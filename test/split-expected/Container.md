### Container · interface

A generic interface for container types

**Type Parameters:**

- `T` - The type of items stored in the container

#### container.items · member

The items in the container

**Type:** `T[]`

#### container.add · member

Add an item to the container

**Type:** `(item: T) => void`

#### container.get · member

Get an item by index

**Type:** `(index: number) => T`
