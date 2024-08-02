# UniEnv

***Unified environment variable management for Node.js, Deno, and Bun.***

## Usage
- ### Code
  ### Node.js and Bun
  ```javascript
  import UniEnv from 'uni-env';
  ```

  ### Deno
  ```typescript
  import UniEnv from "npm:uni-env";
  ```

  ### Example
  ```javascript
  // Referenced from .env file
  const getEnv = UniEnv.get('EXAMPLE');
  if (getEnv.isOk()) console.log(getEnv.value);
  if (getEnv.isNg()) console.error(getEnv.error);


  // Set, reference, and delete environment variables
  // Set environment variables
  const setKey = UniEnv.set('KEY', 'value');
  if (setKey.isOk()) console.log("Successfully set environment variables!");
  if (setKey.isNg()) console.error(setKey.error);

  // Reference environment variables
  const getKey = UniEnv.get('KEY');
  if (getKey.isOk()) console.log(getKey.value);
  if (getKey.isNg()) console.error(getKey.error);
  
  // Delete environment variables
  const rmKey = UniEnv.delete('KEY');
  if (rmKey.isOk()) console.log("Successfully deleted environment variables!");
  if (rmKey.isNg()) console.error(rmKey.error);
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
