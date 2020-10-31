// let name ="Luciano";
// console.log(name);

const summarizeUser =function(userName,userAge,userHobby){
    return(
        "name is"+
        userName+
        ", age is"+
        userAge+
        " and the user has hibbues "+
        userHobby
    );
};
// arrow func
const add= (a,b)=>a+b;
const addOne= a =>a+1;
const addRandom= () =>1+2;

// Objects, properties and methods
const person={
    name:"Luciano",
    age:24,
    greet(){
        console.log("Hi, I am "+this.name);
    }
}
person.greet();
console.log(person);
// Array and array methods
const hobbies=["Sports","Cooking","Dancing"];
for(let hobby of hobbies){
    console.log(hobby);
}
// Create new array, map has function argument that changes the array
const hobbiesEdited =hobbies.map(hobby=>{
    return "Hobby: "+hobby;
})
console.log(hobbiesEdited);
// Referenced, editing the constats, as it just stores a reference to the adress
hobbies.push("programming");
console.log(hobbies);
// Spread and rest operators
// Inmutability, we copy all the array and add a new element
const copied1=hobbies.slice();
const copied2=[...hobbies]; //Spread

const toArray=(...args)=>{//Rest
    return args;
}
console.log(toArray(1,2,3,4,5));

// Destructuring
const printName=({name})=>{
    console.log(name);
}
printName(person);
const [hobby1, hobby2]=hobbies;
console.log(hobby1,hobby2);
const {name, age}=person;
console.log(name,age);

const printName2 = (person)=>{
    console.log(person.name);
}
printName2(person);