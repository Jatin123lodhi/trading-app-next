import { cn } from "../utils"

describe('cn utility', () => {
    it('should merge class names', () => {
        const result = cn('class1', 'class2')
        expect(result).toBeTruthy()
        expect(typeof result).toBe('string')
    })

    it('should handle conditional classes', () => {
        const result = cn('base', false && 'hidden', true && 'visible')
        expect(result).toContain('base')
        expect(result).toBeTruthy()
    })

    it('should merge tailwind classes without conflicts', () => {
        const result = cn('px-2', 'px-4')
        expect(result).toBe('px-4') // tailwind-merge should keep only px-4
    })
})