import logging
import random
import time
import threading

from pymodbus.server import StartTcpServer
from pymodbus.datastore import ModbusSlaveContext, ModbusServerContext
from pymodbus.datastore import ModbusSequentialDataBlock

logging.basicConfig()

# All the addresses you want to simulate
registers_to_update = [
    8192, 8194, 8196, 8198, 8200, 8202, 8204, 8206, 8208, 8210,
    8212, 8214, 8216, 8218, 8220, 8222, 8224, 8226, 8228, 8230,
    8232, 8234, 8242, 8244, 8260, 8262, 8264, 8278,
    4096, 4097, 4098, 4100, 4101, 4102, 4132
]

# Determine how big the register block should be
max_register = max(registers_to_update)
block_size = max_register + 10  # give extra space

# Create Modbus memory blocks
store = ModbusSlaveContext(
    hr=ModbusSequentialDataBlock(0, [0] * block_size)
)
context = ModbusServerContext(slaves={1: store}, single=False)

# Background thread to simulate changes
def update_registers():
    counter = 0
    while True:
        time.sleep(1)
        slave_context = context[1]  # slave ID = 1
        for addr in registers_to_update:
            # Simulate a value
            value = (counter + addr) % 10000  # custom logic
            slave_context.setValues(3, addr, [value])  # 3 = holding register
        counter += 1
        print(f"Updated {len(registers_to_update)} registers at t={counter}s")

# Start update thread
thread = threading.Thread(target=update_registers)
thread.daemon = True
thread.start()

# Start the Modbus TCP server
StartTcpServer(context, address=("0.0.0.0", 1502))
