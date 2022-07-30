/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/no-debugging-utils */
/* eslint-disable testing-library/no-render-in-setup */
import SignupPage from "./SignupPage"
import { render, screen } from "@testing-library/react"
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
      await new Promise((res) => setTimeout(res, 1000))
      expect(submitButton).toBeDisabled()
    })
  })

  describe("Interaction", () => {
    beforeEach(() => {
      render(<SignupPage />)
    })
    let submitBtn
    const setup = () => {
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

    it("enable submit button after typing password and repeat password", () => {
      const pass = screen.getByPlaceholderText("password")
      const passRep = screen.getByPlaceholderText("password repeat")
      userEvent.type(pass, "p4ssword")
      userEvent.type(passRep, "p4ssword")
      const submitBtn = screen.getByRole("button", { name: "Sign up" })
      expect(submitBtn).toBeEnabled()
    })

    it("sign in functionality check", async () => {
      let reqBody
      const server = setupServer(
        rest.post("http://localhost:8080/api/1.0/users", (req, res, ctx) => {
          reqBody = req.body
          return res(ctx.status(200))
        })
      )
      server.listen()
      setup()
      // clicking on submit button
      userEvent.click(submitBtn)

      await screen.findByText("please check email to activate your account")
      expect(reqBody).toEqual({
        username: "user1",
        email: "user1@mail.com",
        password: "P4ssword",
      })
    })
    it("Submit button is disabled 2nd time", async () => {
      let counter = 0
      const server = setupServer(
        rest.post("http://localhost:8080/api/1.0/users", (req, res, ctx) => {
          counter += 1
          return res(ctx.status(200))
        })
      )
      server.listen()
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
      const server = setupServer(
        rest.post("http://localhost:8080/api/1.0/users", (req, res, ctx) => {
          return res(ctx.status(200))
        })
      )
      server.listen()
      setup()
      expect(
        screen.queryByRole("status", { hidden: true })
      ).not.toBeInTheDocument()
      userEvent.click(submitBtn)
      const spinner = screen.getByRole("status", { hidden: true })
      expect(spinner).toBeInTheDocument()
      await screen.findByText("please check email to activate your account")
    })
    it("spinenr should not show when no api calling", async () => {
      setup()
      const spinner = screen.queryByRole("status", { hidden: true })

      expect(spinner).not.toBeInTheDocument()
    })
    it("should show a message please check email to activate your account", async () => {
      const server = setupServer(
        rest.post("http://localhost:8080/api/1.0/users", (req, res, ctx) => {
          return res(ctx.status(200))
        })
      )
      server.listen()
      setup()
      const message = "please check email to activate your account"
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
  })
})
