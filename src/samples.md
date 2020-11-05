---
sidebar: auto
---

# Samples

A collection of basic sample scripts.

## Mathematics

```ttr
var price = 20
val discount = 2
val vat = 21

price += (price / 100 * vat) - discount
```

<sub>See [expressions](../syntax/expressions.md) for details about expressions.</sub>

## Functions

```ttr
fun: string greet(name: string) {
   val greet = 'Hello ' + name
   return greet
}

greet('Niels')
greet('Marnix')
```

<sub>See [functions](../syntax/functions.md) for details about functions.</sub>
