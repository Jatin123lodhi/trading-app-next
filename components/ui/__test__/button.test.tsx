import { Button } from "../button"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

describe('Button Component', () => {
    it('should render button with text', () => {
        render(<Button title="Click me"/>)

        const button = screen.getByRole('button', { name: /click me/i })
        expect(button).toBeInTheDocument()
    })

    it('should call onClick when clicked', async () => {
        const handleClick = jest.fn()
        const user  = userEvent.setup()

        render(<Button onClick={handleClick}>Click me</Button>)

        const button = screen.getByRole('button')
        await user.click(button)

        expect(handleClick).toHaveBeenCalledTimes(1)

    })

})