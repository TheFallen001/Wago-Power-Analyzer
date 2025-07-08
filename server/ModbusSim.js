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
  return [buf.readUInt16BE(2), buf.readUInt16BE(0)];
}
function setRegister(addr, val) {
  const offset = addr * 2;
  holding.writeUInt16BE(val, offset);
}

// Register simulation
const registerMap = {
  8192: () => floatToBE_RE_Registers(randFloat(2200, 2400)),  // UA
  8194: () => floatToBE_RE_Registers(randFloat(220, 240)),  // UB
  8196: () => floatToBE_RE_Registers(randFloat(220, 240)),  // UC
  8198: () => floatToBE_RE_Registers(randFloat(380, 420)),  // UAB
  8200: () => floatToBE_RE_Registers(randFloat(380, 420)),  // UBC
  8202: () => floatToBE_RE_Registers(randFloat(380, 420)),  // UCA
  8204: () => floatToBE_RE_Registers(randFloat(0, 100)),    // IA
  8206: () => floatToBE_RE_Registers(randFloat(0, 100)),    // IB
  8208: () => floatToBE_RE_Registers(randFloat(0, 100)),    // IC
  8210: () => floatToBE_RE_Registers(randFloat(0, 10)),     // IN
  8212: () => floatToBE_RE_Registers(randFloat(0, 50000)),  // PA
  8214: () => floatToBE_RE_Registers(randFloat(0, 50000)),  // PB
  8216: () => floatToBE_RE_Registers(randFloat(0, 50000)),  // PC
  8218: () => floatToBE_RE_Registers(randFloat(0, 150000)), // PT
  8220: () => floatToBE_RE_Registers(randFloat(0, 50000)),  // QA
  8222: () => floatToBE_RE_Registers(randFloat(0, 50000)),  // QB
  8224: () => floatToBE_RE_Registers(randFloat(0, 50000)),  // QC
  8226: () => floatToBE_RE_Registers(randFloat(0, 150000)), // QT
  8228: () => floatToBE_RE_Registers(randFloat(0, 50000)),  // SA
  8230: () => floatToBE_RE_Registers(randFloat(0, 50000)),  // SB
  8232: () => floatToBE_RE_Registers(randFloat(0, 50000)),  // SC
  8234: () => floatToBE_RE_Registers(randFloat(0, 150000)), // ST
  8242: () => floatToBE_RE_Registers(randFloat(0.85, 1.0)), // PF
  8244: () => floatToBE_RE_Registers(randFloat(49.0, 51.0)),// F
  8260: () => floatToBE_RE_Registers(randFloat(0, 360)),    // APangle
  8262: () => floatToBE_RE_Registers(randFloat(0, 360)),    // BPangle
  8264: () => floatToBE_RE_Registers(randFloat(0, 360)),    // CPangle
  8278: () => floatToBE_RE_Registers(randFloat(20, 80)),    // TempIn

  // UINT16
};

holding.writeUInt16BE(1, 4096 * 2);      // 4096 = 1
holding.writeUInt16BE(9600, 4097 * 2);   // 4097 = 9600
holding.writeUInt16BE(1234, 4098 * 2);   // 4098 = random or fixed
holding.writeUInt16BE(9600, 4100 * 2);   // 4100 = 9600
holding.writeUInt16BE(5678, 4101 * 2);   // 4101 = random or fixed
holding.writeUInt16BE(9999, 4102 * 2);   // 4102 = random or fixed
holding.writeUInt16BE(1, 4132 * 2);      // 4132 = 1


// Periodically update values
setInterval(() => {
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
  console.log("Registers updated.");
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
