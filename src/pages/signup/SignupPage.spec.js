/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/no-debugging-utils */
/* eslint-disable testing-library/no-render-in-setup */
import SignupPage from "./SignupPage"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { setupServer } from "msw/node"
import { rest } from "msw/"
import { act } from "react-dom/test-utils"

describe("Sign up page", () => {
  describe("Page Layout", () => {
    beforeEach(() => {
      render(<SignupPage />)
    })
    it("has a heading with text Sign Up", () => {
      const header = screen.getByRole("heading", { name: "SIGN UP" })
      expect(header).toBeInTheDocument()
    })

    it("has username input", () => {
      const username = screen.getByPlaceholderText("username")
      expect(username).toBeInTheDocument()
    })
    it("has email input", () => {
      const email = screen.getByPlaceholderText("email")
      expect(email).toBeInTheDocument()
    })
    it("has password repeat input", () => {
      const passwordrepeat = screen.getByPlaceholderText("password repeat")
      expect(passwordrepeat).toBeInTheDocument()
    })
    it("has button wiht type submit", () => {
      const submitButton = screen.getByRole("button", {
        name: "Sign up",
      })
      expect(submitButton).toBeInTheDocument()
    })
    it("should be disabled by default", async () => {
      const submitButton = screen.getByRole("button", {
        name: "Sign up",
      })
      expect(submitButton).toBeInTheDocument()
      expect(submitButton).toBeDisabled()
    })
  })
  describe("Interaction", () => {
    let submitBtn
    const message = "please check email to activate your account"
    const setup = () => {
      render(<SignupPage />)
      const username = screen.getByLabelText("Username")
      const email = screen.getByLabelText("Email")
      const pass = screen.getByPlaceholderText("password")
      const passRep = screen.getByPlaceholderText("password repeat")
      userEvent.type(username, "user1")
      userEvent.type(email, "user1@mail.com")
      userEvent.type(pass, "P4ssword")
      userEvent.type(passRep, "P4ssword")
      submitBtn = screen.getByRole("button", { name: "Sign up" })
    }

    let reqBody
    let counter
    const server = setupServer(
      rest.post("/api/1.0/users", (req, res, ctx) => {
        reqBody = req.body
        counter = counter + 1
        return res(ctx.status(200))
      })
    )

    beforeAll(() => server.listen())
    afterAll(() => server.close())

    it("enable submit button after typing password and repeat password", () => {
      setup()
      const pass = screen.getByPlaceholderText("password")
      const passRep = screen.getByPlaceholderText("password repeat")
      userEvent.type(pass, "p4ssword")
      userEvent.type(passRep, "p4ssword")
      const submitBtn = screen.getByRole("button", { name: "Sign up" })
      expect(submitBtn).toBeEnabled()
    })

    it("sign in functionality check", async () => {
      setup()
      // clicking on submit button
      userEvent.click(submitBtn)

      await screen.findByText(message)
      expect(reqBody).toEqual({
        username: "user1",
        email: "user1@mail.com",
        password: "P4ssword",
      })
    })

    it("Submit button is disabled 2nd time", async () => {
      counter = 0
      setup()
      // clicking on submit button
      userEvent.click(submitBtn)
      userEvent.click(submitBtn)

      await act(async () => {
        await new Promise((res) => setTimeout(res, 500))
      })

      expect(counter).toBe(1)
    })

    it("should show a spinner with status role", async () => {
      setup()
      expect(
        screen.queryByRole("status", { hidden: true })
      ).not.toBeInTheDocument()
      userEvent.click(submitBtn)
      const spinner = screen.getByRole("status", { hidden: true })
      expect(spinner).toBeInTheDocument()
      await screen.findByText(message)
    })

    it("spinenr should not show when no api calling", async () => {
      setup()
      const spinner = screen.queryByRole("status", { hidden: true })
      expect(spinner).not.toBeInTheDocument()
    })

    it("should show a message please check email to activate your account", async () => {
      setup()
      expect(screen.queryByText(message)).not.toBeInTheDocument()
      userEvent.click(submitBtn)
      let text
      await act(async () => {
        text = await screen.findByText(message)
      })
      // let text = await screen.findByText(message)
      expect(text).toBeInTheDocument()
      // await screen.findByText(message)
    })

    it("hide form when success", async () => {
      setup()

      const form = screen.getByTestId("form-test-id")
      userEvent.click(submitBtn)

      // METHOD 1
      await waitFor(() => {
        expect(form).not.toBeInTheDocument()
      })

      await screen.findByText(message)
    })

    it("should show validation error for username", async () => {
      server.use(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              validationErrors: {
                username: "Username cannot be null",
              },
            })
          )
        })
      )
      setup()
      userEvent.click(submitBtn)
      const usernameError = await screen.findByText("Username cannot be null")
      expect(usernameError).toBeInTheDocument()
    })
  })
})
