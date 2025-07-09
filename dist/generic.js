"use strict";
const userResponse = {
    success: true,
    data: { name: "Rahul" },
};
//generic class
class Box {
    constructor(value) {
        this.content = value;
    }
    get() {
        return this.content;
    }
}
const numberBox = new Box(123);
console.log(numberBox.get()); // 123
