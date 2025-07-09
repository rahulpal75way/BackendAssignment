"use strict";
class UserBuilder {
    constructor() {
        this.user = {};
    }
    setName(name) {
        this.user.name = name;
        return this;
    }
    setAge(age) {
        this.user.age = age;
        return this;
    }
    setEmail(email) {
        this.user.email = email;
        return this;
    }
    build() {
        return this.user;
    }
}
const user = new UserBuilder()
    .setName("Rahul")
    .setAge(25)
    .setEmail("rahul@example.com")
    .build();
console.log(user);
// Output: { name: 'Rahul', age: 25, email: 'rahul@example.com' }
