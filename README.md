# TS Random String Generator
TypeScript utility function to generate random strings.

- Customizable length (default: `5`)
- Support for uppercase, lowercase, number, special, and custom character sets
- Support for unique characters
- Separators for longer strings
- Unique output during each runtime
- Support for custom validator callback

## Example usage

```ts
import RandomString from './RandomString';

// (Default) 5 characters
console.log(RandomString.new()); // e.g.: W8R8f

// 10 characters using only uppercase letters
console.log(RandomString.new(10, { onlyUppercase: true })); // e.g.: VKQQU-NU7G

// 16 characters with no duplicates
console.log(RandomString.new(16, { noDuplicates: true })); // e.g.: LGoIv-E1A20-DdFn

// 5 characters from a custom set
console.log(RandomString.new(5, { customSet: "xyz123!?*"})); // e.g.: 311!y

// 10 characters with maximum 1 number
console.log(RandomString.new(10, { numberLimit: 1 })); // e.g.: tHKUC-Kljb
```

## Documentation

### `RandomString.new(length?, options?, isValid?): string`

Static method to generate a random string.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `length` | `number` | `5` | Length for the generated string. Separators count towards the length. |
| `options` | `RandomStringOptions` | `{}` | Generation options. |
| `isValid` | `(string: string) => boolean` | — | Return `false` to reject a candidate string. Failure will regenerate. |

Returns `string` (the random string).

### Generation options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `onlyUppercase` | `boolean` | `false` | Include only uppercase letters. Note: Does not exclude non-letter characters. |
| `onlyLowercase` | `boolean` | `false` | Include only lowercase letters. Note: Does not exclude non-letter characters. |
| `includeLetters` | `boolean` | `true` | Include letters. |
| `includeNumbers` | `boolean` | `true` | Include digits `0-9`. |
| `includeSpecials` | `boolean` | `false` | Include special characters (`~!@#$%&*?`). |
| `noDuplicates` | `boolean` | `false` | Each character should be included only once per string. |
| `separate` | `boolean` | `true` | Should use `-` separators within long string. |
| `customSet` | `string` | `''` | Provides a custom character set from which the string will be generated. Note: overrides all other character options. |
| `numberLimit` | `number` | `Infinity` | Maximum number of number characters to include in the string. Note: this is a maximum limit; the generated string may include fewer. |

### Separators

When `options.separate` is enabled, `-` will be inserted into the generated string to make it segmented. Strings shorter than 7 characters long will never be separated. For strings with lenghts 7–14, it will follow the following template. For longer strings, separators will be inserted as every 6th character.

#### Template

* fewer than 7 characters: no separation
* 7 characters: xxx-xxx
* 8 characters: xxxx-xxx
* 9 characters: xxxx-xxxx 
* 10 characters: xxxxx-xxxx 
* 11 characters: xxx-xxx-xxxx 
* 12 characters: xxxx-xxxx-xxx 
* 13 characters: xxxx-xxxx-xxxx
* 14 characters: xxxx-xxxx-xxxxx
* more than 14 characters: separation at every 6th character

## Errors

An error will be thrown when

- `length` is zero or negative,
- the character set does not include enough characters, or
- a valid (unique) string could not be generated even following 10 retries

## License

GPLv2 © Leo Wurmbrand 2025–2026