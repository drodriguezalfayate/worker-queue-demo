import {Person} from "./Person";

test('Test constructor',()=>{
    const p = new Person({id:3,name:'Jhon',surname:'Richard'});
    expect(p.id).toBe(3);
    expect(p.name).toBe('Jhon');
    expect(p.surname).toBe('Richard');

})

test('Verifying fullname',()=>{
    const p = new Person({id:3,name:'Jhon',surname:'Richard'});
    expect(p.fullname).toBe('Jhon Richard');
    p.name = undefined;
    expect(p.fullname).toBe('Richard');
    p.name = '';
    expect(p.fullname).toBe('Richard');
    p.surname='';
    expect(p.fullname).toBe('');
    p.surname=undefined;
    expect(p.fullname).toBeUndefined();
});

test('Verifying acronym',()=>{
    const p = new Person({id:3,name:'Jhon',surname:'richard'});
    expect(p.acronym).toBe('JR');
    p.surname = '';
    expect(p.acronym).toBe('JH');
    p.name = '';
    expect(p.acronym).toBeUndefined();
    p.surname = 'richard';
    expect(p.acronym).toBe('RI');
})


test('Verifying URI',()=>{
    const p = new Person({id:3,name:'Jhon',surname:'richard',uri:'sdfsdff'});
    expect(p.uri).toBe('sdfsdff');
})