# UniEnv

***Unified environment variable management for Node.js, Deno, and Bun.***

## Usage
- ### Code
  ### Node.js and Bun
  ```javascript
  import UniEnv from "@redpeacock78/unienv";
  ```

  ### Deno
  ```typescript
  import UniEnv from "npm:@redpeacock78/unienv";
  ```

  ### Example
  ```javascript
  // Referenced from .env file
  const getEnv = UniEnv.get("EXAMPLE");
  if (getEnv.isOk()) console.log(getEnv.value);
  if (getEnv.isNg()) console.error(getEnv.error);


  // Set, reference, and delete environment variables
  // Set environment variables
  const setKey = UniEnv.set("KEY", "value");
  if (setKey.isNg()) console.error(setKey.error.message);
  if (setKey.isOk()) console.log("Successfully set environment variables!");

  // Reference environment variables
  const getKey = UniEnv.get("KEY");
  if (getKey.isNg()) console.error(getKey.error.message);
  if (getKey.isOk()) {
    if (!getKey.value) {
      console.log("KEY is not set!");
    } else {
      console.log(getKey.value);
    }
  }
  
  // Delete environment variables
  const rmKey = UniEnv.delete("KEY");
  if (rmKey.isNg()) console.error(rmKey.error.message);
  if (rmKey.isOk()) console.log("Successfully deleted environment variables!");
  ```

- ### Run
  ### Node.js
  ```bash
  node index.js
  ```
  ### Bun
  ```bash
  bun run index.js
  ```
  ### Deno
  ```bash
  deno run --allow-read --allow-env index.ts
  ```

## Runtime Version Requirements
|Node.js|Bun|Deno|
|:-:|:-:|:-:|
|✅ `12.0.0` or higher|✅ `1.0` or higher|✅ `1.30.0` or higher|

## License
MIT
