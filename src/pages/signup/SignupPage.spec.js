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

      await act(async () => {
        await new Promise((res) => setTimeout(res, 1000))
      })

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
  })
})
