/**
 * @file Functionality to generate a random string.
 * 
 * @version 1.0.0
 * 
 * @author Leo Wurmbrand <leo.wurmbrand@gmail.com>
 * @copyright Leo Wurmbrand 2025–2026
 * @license GPLv2
 */

/** Option parameters */
type RandomStringOptions = {
	onlyUppercase?: boolean;
	onlyLowercase?: boolean;
	includeLetters?: boolean;
	includeNumbers?: boolean;
	includeSpecials?: boolean;
	noDuplicates?: boolean;
	separate?: boolean;
	customSet?: string;
	numberLimit?: number;
};

/** Type for parameter of function that validates a string. */
type ValidatorCallback = (string: string) => boolean;

/** Set to keep track of all generated strings. */
const randomStrings = new Set();


/*
 * ******************************************
 * ! Random string generation
 * ******************************************
 */


/** 
 * Utility class for generating random strings with customizable options. 
 * 
 * @since 1.0.0
 * 
 * @example const random = RandomString.new(10, { includeNumbers: false });
 */
export default class RandomString {

	/**
	 * Counter to prevent infinite recursion when generating unique strings.
	 * @private
	 */
	private randomStringCounter: number = 0;

	/**
	 * Creates and returns a new random string.
	 *
	 * @param {number} [length=5] - Desired length of the string.
	 * @param {RandomStringOptions} [options={}] - Configuration options.
	 * @returns {string} Generated random string.
	 */
	public static new(length?: number, options?: RandomStringOptions, isValid?: ValidatorCallback) {

		return new RandomString().build(length, options, isValid);

	}

	/**
	 * Builds a random string based on given length and options.
	 *
	 * @param {number} [length=5] - Length of the string.
	 * @param {RandomStringOptions} [options={}] - Generation options.
	 * @returns {string} Generated string.
	 */
	private build(...args: [number?, RandomStringOptions?, ValidatorCallback?]): string {

		const [
			length = 5,
			options = {},
			isValid
		] = args;

		const {
			onlyUppercase = false,
			onlyLowercase = false,
			includeLetters = true,
			includeNumbers = true,
			includeSpecials = false,
			noDuplicates = false,
			separate = true,
			customSet = '',
			numberLimit = Infinity
		} = options;

		const characters = this.buildCharacterSet({
			onlyUppercase,
			onlyLowercase,
			includeLetters,
			includeNumbers,
			includeSpecials,
			customSet
		});

		const result = this.buildString(length, characters, {
			noDuplicates,
			separate,
			numberLimit
		});

		return this.check(result, length, options, isValid);
	
	}

	/**
	 * Builds the character set used for random generation.
	 *
	 * @private
	 * @param {object} options - Character set options.
	 * @param {boolean} options.onlyUppercase - Use only uppercase letters.
	 * @param {boolean} options.onlyLowercase - Use only lowercase letters.
	 * @param {boolean} options.includeLetters - Include alphabetic characters.
	 * @param {boolean} options.includeNumbers - Include numeric characters.
	 * @param {boolean} options.includeSpecials - Include special characters.
	 * @param {string | string[] | number[]} options.customSet - Custom character set (overrides all other options).
	 * @returns {string} Character set string.
	 */
	private buildCharacterSet(options: Required<Pick<
		RandomStringOptions,
		'onlyUppercase' | 'onlyLowercase' | 'includeLetters' | 'includeNumbers' | 'includeSpecials'
	>> & { customSet: string | string[] | number[] }): string {

		if (options.customSet !== '') {

			if (Array.isArray(options.customSet)) return options.customSet.map((num) => num.toString()).join('');

			return options.customSet;
		
		}

		let characters = '';

		if (options.includeLetters) {

			if (options.onlyUppercase && !options.onlyLowercase) {

				characters += UPPERCASE;
			
			} else if (!options.onlyUppercase && options.onlyLowercase) {

				characters += LOWERCASE;
			
			} else {

				characters += UPPERCASE + LOWERCASE;
			
			}
		
		}

		if (options.includeNumbers) characters += NUMBERS;
		if (options.includeSpecials) characters += SPECIALS;

		return characters;
	
	}

	/**
	 * Generates a random string from a given character set.
	 *
	 * @private
	 * @param {number} length - Desired string length.
	 * @param {string} initialCharacters - Available characters.
	 * @param {object} options - Generation options.
	 * @param {boolean} options.noDuplicates - Prevent duplicate characters.
	 * @param {boolean} options.separate - Insert separators.
	 * @returns {string} Generated string.
	 * @throws {Error} If generation is not possible due to insufficient characters.
	 */
	private buildString(
		length: number,
		initialCharacters: string,
		options: {
			noDuplicates: boolean;
			separate: boolean;
			numberLimit: number;
		}
	): string {

		let characters = initialCharacters;
		let result = '';
		let numberCount = 0;

		if (length <= 0) throw new Error('String length must be a positive value.');

		for (let i = 0; i < length; i++) {

			const availableCharacters = numberCount >= options.numberLimit ? this.stripNumbers(characters) : characters;

			if (availableCharacters.length === 0) {

				throw new Error('Could not generate a value. Try a longer length or adjusting the options.');
			
			}

			if (this.shouldInsertSeparator(i, length, options.separate)) {

				result += '-';
				continue;
			
			}

			const randomIndex = Math.floor(Math.random() * availableCharacters.length);
			const char = availableCharacters.charAt(randomIndex);

			result += char;

			if (NUMBERS.includes(char)) numberCount++;

			if (options.noDuplicates) {

				const originalIndex = characters.indexOf(char);

				characters =
					characters.slice(0, originalIndex) +
					characters.slice(originalIndex + 1);
			
			}

		}

		return result;
	
	}

	/**
	 * Removes numeric characters from a character set.
	 *
	 * @private
	 * @param {string} characters - Character set to filter.
	 * @returns {string} Character set without numbers.
	 */
	private stripNumbers(characters: string): string {

		return characters
			.split('')
			.filter((char) => !NUMBERS.includes(char))
			.join('');

	}

	/**
	 * Determines whether a separator should be inserted at a given index.
	 *
	 * @private
	 * @param {number} index - Current position in the string.
	 * @param {number} length - Total desired length.
	 * @param {boolean} separate - Whether separation is enabled.
	 * @returns {boolean} True if a separator should be inserted.
	 */
	private shouldInsertSeparator(
		index: number,
		length: number,
		separate: boolean
	): boolean {

		if (!separate) return false;

		const template = SEPARATION_TEMPLATE[length];

		if (template) return template.includes(index);

		if (length >= 15) return (index + 1) % 6 === 0 && (index + 1) < length;

		return false;
	
	}

	/**
	 * Ensures the generated string is unique.
	 *
	 * Retries generation up to 10 times if duplicates are found.
	 *
	 * @private
	 * @param {string} string - Generated string.
	 * @param {number} length - Desired length.
	 * @param {RandomStringOptions} options - Generation options.
	 * @returns {string} Unique string.
	 * @throws {Error} If a unique string cannot be generated.
	 */
	private check(
		string: string,
		length: number,
		options: RandomStringOptions,
		isValid?: ValidatorCallback
	): string {

		if (randomStrings.has(string) || (isValid && !isValid(string))) {

			this.randomStringCounter++;

			if (this.randomStringCounter > 10) {

				throw new Error('Could not generate a new unique value. Try a longer length.');
			
			}

			return this.build(length, options);
		
		}

		this.randomStringCounter = 0;
		randomStrings.add(string);
		return string;
	
	}

}

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWYXZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvxyz';
const NUMBERS = '0123456789';
const SPECIALS = '~!@#$%&*?';
const SEPARATION_TEMPLATE: Record<number, number[]> = {
	7: [ 3 ],
	8: [ 4 ],
	9: [ 4 ],
	10: [ 5 ],
	11: [ 3, 7 ],
	12: [ 4, 9 ],
	13: [ 4, 9 ],
	14: [ 4, 9 ]
};
