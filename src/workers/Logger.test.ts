import {Logger} from "./Logger";

test('Logging debug',()=>{
    const l = new Logger('worker');
    // eslint-disable-next-line no-restricted-globals
    self.postMessage = jest.fn((message:any)=>{
        expect(message.worker).toBe('worker');
        expect(message.level).toBe('debug');
        expect(message.message).toBe('Hola');
    })
    // eslint-disable-next-line testing-library/no-debugging-utils
    l.debug('Hola');
    // eslint-disable-next-line no-restricted-globals
    expect(self.postMessage).toHaveBeenCalledTimes(1);


})

test('Logging info',()=>{
    const l = new Logger('worker');
    // eslint-disable-next-line no-restricted-globals
    self.postMessage = jest.fn((message:any)=>{
        expect(message.worker).toBe('worker');
        expect(message.level).toBe('info');
        expect(message.message).toBe('Hola');
    })
    l.info('Hola');
    // eslint-disable-next-line no-restricted-globals
    expect(self.postMessage).toHaveBeenCalledTimes(1);


})

test('Logging warn',()=>{
    const l = new Logger('worker');
    // eslint-disable-next-line no-restricted-globals
    self.postMessage = jest.fn((message:any)=>{
        expect(message.worker).toBe('worker');
        expect(message.level).toBe('warn');
        expect(message.message).toBe('Hola');
    })
    l.warn('Hola');
    // eslint-disable-next-line no-restricted-globals
    expect(self.postMessage).toHaveBeenCalledTimes(1);


})


test('Logging error',()=>{
    const l = new Logger('worker');
    // eslint-disable-next-line no-restricted-globals
    self.postMessage = jest.fn((message:any)=>{
        expect(message.worker).toBe('worker');
        expect(message.level).toBe('error');
        expect(message.message).toBe('Hola');
    })
    l.error('Hola');
    // eslint-disable-next-line no-restricted-globals
    expect(self.postMessage).toHaveBeenCalledTimes(1);


})


test('Logging error with error',()=>{
    const l = new Logger('worker');
    // eslint-disable-next-line no-restricted-globals
    self.postMessage = jest.fn((message:any)=>{
        expect(message.worker).toBe('worker');
        expect(message.level).toBe('error');
        expect(message.message.message).toBe('pepe');
    })
    l.error(new Error('pepe'));
    // eslint-disable-next-line no-restricted-globals
    expect(self.postMessage).toHaveBeenCalledTimes(1);


})