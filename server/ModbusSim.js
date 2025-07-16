const net = require("net");
const jsmodbus = require("jsmodbus");

// Create Modbus server socket
const serverSocket = new net.Server();
const holding = Buffer.alloc(65536); // 32K 16-bit registers

// Helpers
function randFloat(min, max) {
  return Math.random() * (max - min) + min;
}
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function floatToBE_RE_Registers(value) {
  const buf = Buffer.alloc(4);
  buf.writeFloatBE(value);
  return [buf.readUInt16BE(0), buf.readUInt16BE(2)];
}

function setRegister(addr, val) {
  const offset = addr * 2;
  holding.writeUInt16BE(val, offset);
}

// Configurable static registers (set once at startup)
const staticRegisters = {
  4096: 1,      // Addr1: 1-247
  4097: 9600,   // Baud1: 1200,2400,4800,9600,19200,38400,57600
  4098: 0,      // Check1: 0,1,2
  4100: 9600,   // Baud2: 1200,2400,4800,9600,19200,38400,57600
  4101: 0,      // Check2: 0,1,2
  4102: 1,      // 645Addr: 1-247
  4132: 1,      // Mode: 1 or 2
};

// Realistic power simulation state
let simState = {
  UA: randFloat(220, 240), // Phase A voltage (V)
  PF: randFloat(0.92, 0.99), // Power factor
  F: randFloat(49.8, 50.2), // Frequency (Hz)
  PT: randFloat(3000, 15000), // Total active power (W)
  lat: 41.0329, // Istanbul (from IP geolocation)
  lng: 28.9529,
};

function updateSimState() {
  // Small random walk for realism
  simState.UA += randFloat(-0.5, 0.5);
  simState.UA = Math.max(220, Math.min(240, simState.UA));
  simState.PF += randFloat(-0.01, 0.01);
  simState.PF = Math.max(0.85, Math.min(1.0, simState.PF));
  simState.F += randFloat(-0.02, 0.02);
  simState.F = Math.max(49.8, Math.min(50.2, simState.F));
  simState.PT += randFloat(-100, 100);
  simState.PT = Math.max(1000, Math.min(15000, simState.PT));
  // Slightly adjust lat/lng for realism (within ~0.001 deg)

}

function getIA() {
  // I = P / (U * PF)
  return simState.PT / (simState.UA * simState.PF);
}

function getQT() {
  // QT = PT * tan(acos(PF))
  return simState.PT * Math.tan(Math.acos(simState.PF));
}

// Register simulation (periodically updated)
const registerMap = {
  8192: () => floatToBE_RE_Registers(simState.UA),         // UA: Phase A voltage (V)
  8204: () => floatToBE_RE_Registers(getIA()),             // IA: Phase A current (A)
  8218: () => floatToBE_RE_Registers(simState.PT),         // PT: Total active power (W)
  8226: () => floatToBE_RE_Registers(getQT()),             // QT: Total reactive power (var)
  8242: () => floatToBE_RE_Registers(simState.PF),         // PF: Power factor
  8244: () => floatToBE_RE_Registers(simState.F),          // F: Frequency (Hz)
  // lat/lng as fixed values (Bucharest)
  // 8300: () => floatToBE_RE_Registers(simState.lat),         // lat (dynamic, near actual)
  // 8302: () => floatToBE_RE_Registers(simState.lng),         // lng (dynamic, near actual)
  // The rest can be simulated as before or left as is
  8194: () => floatToBE_RE_Registers(randFloat(220, 240)), // UB
  8196: () => floatToBE_RE_Registers(randFloat(220, 240)), // UC
  8198: () => floatToBE_RE_Registers(randFloat(380, 420)), // UAB
  8200: () => floatToBE_RE_Registers(randFloat(380, 420)), // UBC
  8202: () => floatToBE_RE_Registers(randFloat(380, 420)), // UCA
  8206: () => floatToBE_RE_Registers(randFloat(0, 100)),   // IB
  8208: () => floatToBE_RE_Registers(randFloat(0, 100)),   // IC
  8210: () => floatToBE_RE_Registers(randFloat(0, 10)),    // IN
  8212: () => floatToBE_RE_Registers(randFloat(0, 50000)), // PA
  8214: () => floatToBE_RE_Registers(randFloat(0, 50000)), // PB
  8216: () => floatToBE_RE_Registers(randFloat(0, 50000)), // PC
  8220: () => floatToBE_RE_Registers(randFloat(0, 50000)), // QA
  8222: () => floatToBE_RE_Registers(randFloat(0, 50000)), // QB
  8224: () => floatToBE_RE_Registers(randFloat(0, 50000)), // QC
  8228: () => floatToBE_RE_Registers(randFloat(0, 50000)), // SA
  8230: () => floatToBE_RE_Registers(randFloat(0, 50000)), // SB
  8232: () => floatToBE_RE_Registers(randFloat(0, 50000)), // SC
  8234: () => floatToBE_RE_Registers(randFloat(0, 150000)),// ST
  8260: () => floatToBE_RE_Registers(randFloat(0, 360)),   // APangle
  8262: () => floatToBE_RE_Registers(randFloat(0, 360)),   // BPangle
  8264: () => floatToBE_RE_Registers(randFloat(0, 360)),   // CPangle
  8278: () => floatToBE_RE_Registers(randFloat(20, 80)),   // TempIn
};


// Set static registers once at startup
for (const [addr, val] of Object.entries(staticRegisters)) {
  holding.writeUInt16BE(val, parseInt(addr) * 2);
}


// Periodically update only dynamic values
setInterval(() => {
  updateSimState();
  for (let addr in registerMap) {
    addr = parseInt(addr);
    const val = registerMap[addr]();
    if (val.length === 2) {
      setRegister(addr, val[0]);
      setRegister(addr + 1, val[1]);
    } else {
      setRegister(addr, val[0]);
    }
  }
  // console.log("Registers updated.");
}, 1000);

// Start TCP Modbus server
const server = new jsmodbus.server.TCP(serverSocket, {
  holding: holding,
  input: holding,  // share same data
  unitId: 1,
});




module.exports = {
  server,
  serverSocket,
  holding,
};
