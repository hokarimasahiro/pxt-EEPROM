/**
 * makecode EEPROM Package.
 */

/**
 * EEPROM block
 */
//% weight=100 color=#303030 icon="\uf2db" block="EEPROM"
namespace EEPROM {
    let EEPROM_ADDR = 0x50;
    let pageSize = 256;

    /**
     * Write byte data to the specified address
     * @param addr eeprom address, eg: 1
     * @param dat is the data will be write, eg: 5
     */
    //% blockId="WriteByte" block="eeprom address %addr|write byte %dat"
    //% weight=100 blockGap=8
    export function writeByte(addr: number, dat: number): void {
        let address = EEPROM_ADDR + (addr >> 16)
        let buf = pins.createBuffer(3);
        buf[0] = addr >> 8;
        buf[1] = addr;
        buf[2] = dat;
        pins.i2cWriteBuffer(address, buf)
    }

    /**
     * Read byte data from the specified address
     * @param addr eeprom address, eg: 1
     */
    //% blockId="ReadByte" block="read byte from address %addr"
    //% weight=99 blockGap=8
    export function readByte(addr: number): number {
        let address = EEPROM_ADDR + (addr >> 16)
        pins.i2cWriteNumber(address, addr, NumberFormat.UInt16BE);
        return pins.i2cReadNumber(address, NumberFormat.UInt8BE);
    }

    /**
     * Write word data to the specified address
     * @param addr eeprom address, eg: 2
     * @param dat is the data will be write, eg: 6
     */
    //% blockId="WriteWord" block="eeprom address %addr|write word %dat"
    //% weight=90 blockGap=8
    export function writeWord(addr: number, dat: number): void {
        let address = EEPROM_ADDR + (addr >> 16)
        let buf = pins.createBuffer(4);
        buf[0] = addr >> 8;
        buf[1] = addr;
        buf[2] = dat >> 8;
        buf[3] = dat;
        pins.i2cWriteBuffer(address, buf)
    }

    /**
     * Read word data from the specified address
     * @param addr eeprom address, eg: 2
     */
    //% blockId="ReadWord" block="read word from address %addr"
    //% weight=89 blockGap=8
    export function readWord(addr: number): number {
        let address = EEPROM_ADDR + (addr >> 16)
        pins.i2cWriteNumber(address, addr, NumberFormat.UInt16BE);
        return pins.i2cReadNumber(address, NumberFormat.UInt16BE);
    }

    /**
     * Write double word data to the specified address
     * @param addr eeprom address, eg: 4
     * @param dat is the data will be write, eg: 7
     */
    //% blockId="WriteDWord" block="eeprom address %addr|write dword %dat"
    //% weight=80 blockGap=8
    export function writeDword(addr: number, dat: number): void {
        let address = EEPROM_ADDR + (addr >>> 16)
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
     * Read double word data from the specified address
     * @param addr eeprom address, eg: 4
     */
    //% blockId="ReadDWord" block="read dword from address %addr"
    //% weight=79 blockGap=8
    export function readDword(addr: number): number {
        let address = EEPROM_ADDR + (addr >>> 16)
        pins.i2cWriteNumber(address, addr, NumberFormat.UInt16BE);
        return pins.i2cReadNumber(address, NumberFormat.Int32BE);
    }

    /**
     * Write data to the specified address
     * @param addr eeprom address, eg: 1
     * @param dat is the data will be write
     */
    //% blockId="WriteBuf" block="eeprom address %addr|write multi %dat"
    //% weight=100 blockGap=8
    export function writeBuf(addr: number, dat: number[]): void {
        let address = EEPROM_ADDR + (addr >> 16)
        let buf = pins.createBuffer(pageSize + 2);
        buf[0] = addr >> 8;
        buf[1] = addr >> 0;
        for(let i=0;i<dat.length;i++){
            buf[(i % pageSize) + 2] = dat[i] & 0xff;
            if (((addr + i) % pageSize) == (pageSize - 1)){
                pins.i2cWriteBuffer(address, buf);
                buf[0] = (addr + i + 1) >> 8;
                buf[1] = (addr + i + 1) >> 0;
            }
        }
        pins.i2cWriteBuffer(address, buf)
    }

    /**
     * Read data from the specified address
     * @param addr eeprom address, eg: 1
     * @param size read data count, eg: 16
     */
    //% blockId="ReadBuf" block="read multi from eeprom address %addr|size %size"
    //% weight=100 blockGap=8
    export function readBuf(addr: number, size: number): number[] {
        let address = EEPROM_ADDR + (addr >> 16)
        let retbuf:number[]=[];

        pins.i2cWriteNumber(address, addr, NumberFormat.UInt16BE);
        let buf = pins.i2cReadBuffer(address, size);
        for(let i=0;i<size;i++){
            retbuf.push(buf[i]);
        }
        return retbuf;
    }


    /**
     * Write strings to the specified address
     * @param addr eeprom address, eg: 1
     * @param dat is the data will be write, eg: "abcd"
     */
    //% blockId="WriteStr" block="eeprom address %addr|write strings %dat"
    //% weight=100 blockGap=8
    export function writeStr(addr: number, dat: string): void {
        let address = EEPROM_ADDR + (addr >> 16)
        let buf = pins.createBuffer(pageSize + 2);
        let i:number,j:number;
        buf[0] = addr >> 8;
        buf[1] = addr >> 0;
        for(i=0;i<pageSize;i++){
            if (i < dat.length) buf[i + 2] = dat.charCodeAt(i);
            else buf[i + 2] = 0x00;
        }
        pins.i2cWriteBuffer(address, buf);
    }

    /**
     * Read strings from the specified address
     * @param addr eeprom address, eg: 1
     * @param maxsize read data count max, eg: 1024
     */
    //% blockId="ReadStr" block="read strings from eeprom address %addr|maxsize %maxsize"
    //% weight=100 blockGap=8
    export function readStr(addr: number,maxsize:number): string {
        let address = EEPROM_ADDR + (addr >> 16)
        let retstr:string="";

        pins.i2cWriteNumber(address, addr, NumberFormat.UInt16BE);
        let buf = pins.i2cReadBuffer(address, maxsize);
        for(let i=0;i<maxsize;i++){
            if (buf[i]==0x00 || buf[i]==0xff) break;
            retstr = retstr + String.fromCharCode(buf[i]);
        }
        return retstr;
    }

    /**
     * set i2c address
     * @param addr i2c address, eg: 0x50
     */
    //% blockId="setI2cAddress" block="i2c address set to %addr"
    //% weight=70 blockGap=8
    export function setI2cAddress(addr: number): void {
        EEPROM_ADDR = addr
    }
}
