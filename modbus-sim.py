import logging
import random
import time
import threading
import struct

from pymodbus.server import StartTcpServer
from pymodbus.datastore import ModbusSlaveContext, ModbusServerContext
from pymodbus.datastore import ModbusSequentialDataBlock

logging.basicConfig()

# Map of register address to simulation logic
register_definitions = {
    # Voltage (220–240 V)
    8192: lambda: random.uniform(220, 240),  # UA
    8194: lambda: random.uniform(220, 240),  # UB
    8196: lambda: random.uniform(220, 240),  # UC
    8198: lambda: random.uniform(380, 420),  # UAB
    8200: lambda: random.uniform(380, 420),  # UBC
    8202: lambda: random.uniform(380, 420),  # UCA

    # Current (0–100 A)
    8204: lambda: random.uniform(0, 100),  # IA
    8206: lambda: random.uniform(0, 100),  # IB
    8208: lambda: random.uniform(0, 100),  # IC
    8210: lambda: random.uniform(0, 10),   # IN

    # Power (0–50000 W)
    8212: lambda: random.uniform(0, 50000),  # PA
    8214: lambda: random.uniform(0, 50000),  # PB
    8216: lambda: random.uniform(0, 50000),  # PC
    8218: lambda: random.uniform(0, 150000),  # PT

    # Reactive Power
    8220: lambda: random.uniform(0, 50000),  # QA
    8222: lambda: random.uniform(0, 50000),  # QB
    8224: lambda: random.uniform(0, 50000),  # QC
    8226: lambda: random.uniform(0, 150000), # QT

    # Apparent Power
    8228: lambda: random.uniform(0, 50000),  # SA
    8230: lambda: random.uniform(0, 50000),  # SB
    8232: lambda: random.uniform(0, 50000),  # SC
    8234: lambda: random.uniform(0, 150000), # ST

    # Power factor
    8242: lambda: random.uniform(0.85, 1.0),  # PF

    # Frequency
    8244: lambda: random.uniform(49.0, 51.0),  # F

    # Angles (degrees)
    8260: lambda: random.uniform(0, 360),  # APangle
    8262: lambda: random.uniform(0, 360),  # BPangle
    8264: lambda: random.uniform(0, 360),  # CPangle

    # Temperature
    8278: lambda: random.uniform(20, 80),  # Templn

    # UINT16 config fields
    4096: lambda: 1,
    4097: lambda: 9600,
    4098: lambda: random.randint(0, 9999),
    4100: lambda: 9600,
    4101: lambda: random.randint(0, 9999),
    4102: lambda: random.randint(0, 65535),
    4132: lambda: 1,
}

# Prepare register list
registers_to_update = list(register_definitions.keys())
max_register = max(registers_to_update)
block_size = max_register + 10

# Create Modbus store
store = ModbusSlaveContext(hr=ModbusSequentialDataBlock(0, [0]*block_size))
context = ModbusServerContext(slaves={1: store}, single=False)

# Helper to write float as two 16-bit registers (big-endian)
def float_to_regs(value: float):
    b = struct.pack('>f', value)
    return [int.from_bytes(b[:2], 'big'), int.from_bytes(b[2:], 'big')]

# Background simulation
def update_registers():
    while True:
        time.sleep(1)
        slave = context[1]
        for addr, generator in register_definitions.items():
            val = generator()
            if addr >= 8192:  # FLOAT32 range
                regs = float_to_regs(val)
                slave.setValues(3, addr, regs)
            else:  # UINT16
                slave.setValues(3, addr, [val])
        print("Registers updated with simulated values.")

# Start simulation thread
threading.Thread(target=update_registers, daemon=True).start()

# Start Modbus TCP server
StartTcpServer(context, address=("0.0.0.0", 1502))
