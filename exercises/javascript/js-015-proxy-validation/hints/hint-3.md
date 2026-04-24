# Hint 3 -- Strong

Here are all the fixes:

**set trap** -- add `return true` and use `Reflect.set`:
```typescript
Reflect.set(target, prop, value, receiver);
return true;
```

**get trap** -- use `Reflect.get`:
```typescript
return Reflect.get(target, prop, receiver);
```

**Numeric validation** -- add after type check:
```typescript
if (field.min !== undefined && value < field.min) throw new Error(`...min...`);
if (field.max !== undefined && value > field.max) throw new Error(`...max...`);
```

**String validation** -- add after type check:
```typescript
if (field.minLength !== undefined && value.length < field.minLength) throw ...;
if (field.maxLength !== undefined && value.length > field.maxLength) throw ...;
```

**has trap** -- check schema too:
```typescript
return String(prop) in schema || Reflect.has(target, prop);
```
