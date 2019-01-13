/**
 * makecode S-24CMxxC EEPROM Package.
 * From microbit/micropython Chinese community.
 * http://www.micropython.org.cn
 */

/**
 * EEPROM block
 */
//% weight=100 color=#303030 icon="\uf2db" block="EEPROM"
namespace EEPROM {
    let EEPROM_ADDR = 0x50;

    /**
     * write a byte to special address
     * @param addr eeprom address, eg: 1
     * @param dat is the data will be write, eg: 5
     */
    //% blockId="WriteByte" block="eeprom address %addr|write byte %dat"
    //% weight=100 blockGap=8
    export function writeByte(addr: number, dat: number): void {
        let address=EEPROM_ADDR + addr >>> 16
        let buf = pins.createBuffer(3);
        buf[0] = addr >> 8;
        buf[1] = addr;
        buf[2] = dat;
        pins.i2cWriteBuffer(address, buf)
    }

    /**
     * read a byte from special address
     * @param addr eeprom address, eg: 1
     */
    //% blockId="ReadByte" block="read byte from address %addr"
    //% weight=99 blockGap=8
    export function readByte(addr: number): number {
        let address = EEPROM_ADDR + addr >>> 16
        pins.i2cWriteNumber(address, addr, NumberFormat.UInt16BE);
        return pins.i2cReadNumber(address, NumberFormat.UInt8BE);
    }

    /**
     * write a word to special address
     * @param addr eeprom address, eg: 2
     * @param dat is the data will be write, eg: 6
     */
    //% blockId="WriteWord" block="eeprom address %addr|write word %dat"
    //% weight=90 blockGap=8
    export function writeWord(addr: number, dat: number): void {
        let address = EEPROM_ADDR + addr >>> 16
        let buf = pins.createBuffer(4);
        buf[0] = addr >> 8;
        buf[1] = addr;
        buf[2] = dat >> 8;
        buf[3] = dat;
        pins.i2cWriteBuffer(address, buf)
    }

    /**
     * read a word from special address
     * @param addr eeprom address, eg: 2
     */
    //% blockId="ReadWord" block="read word from address %addr"
    //% weight=89 blockGap=8
    export function readWord(addr: number): number {
        let address = EEPROM_ADDR + addr >>> 16
        pins.i2cWriteNumber(address, addr, NumberFormat.UInt16BE);
        return pins.i2cReadNumber(address, NumberFormat.UInt16BE);
    }

    /**
     * write a dword to special address
     * @param addr eeprom address, eg: 4
     * @param dat is the data will be write, eg: 7
     */
    //% blockId="WriteDWord" block="eeprom address %addr|write dword %dat"
    //% weight=80 blockGap=8
    export function writeDword(addr: number, dat: number): void {
        let address = EEPROM_ADDR + addr >>> 16
        let buf = pins.createBuffer(6);
        buf[0] = addr >> 8;
        buf[1] = addr;
        buf[2] = dat >> 24;
        buf[3] = dat >> 16;
        buf[4] = dat >> 8;
        buf[5] = dat;
        pins.i2cWriteBuffer(address, buf)
    }

    /**
     * read a dword from special address
     * @param addr eeprom address, eg: 4
     */
    //% blockId="ReadDWord" block="read dword from address %addr"
    //% weight=79 blockGap=8
    export function readDword(addr: number): number {
        let address = EEPROM_ADDR + addr >>> 16
        pins.i2cWriteNumber(address, addr, NumberFormat.UInt16BE);
        return pins.i2cReadNumber(address, NumberFormat.Int32BE);
    }

    /**
     * set i2c address
     * @param addr i2c address, eg: 0x50
     */
    //% blockId="setI2cAddress" block="i2c address set to %addr"
    //% weight=70 blockGap=8
    export function setI2cAddress(addr: number): void {
        EEPROM_ADDR=addr
    }
}
