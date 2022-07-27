/* eslint-disable testing-library/no-render-in-setup */
import SignupPage from "./SignupPage"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import axios from "axios"
import { setupServer } from "msw/node"
import { rest } from "msw/"

describe("Sign up page", () => {
  describe("Page Layout ", () => {
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
    it("should be disabled by default", () => {
      const submitButton = screen.getByRole("button", {
        name: "Sign up",
      })
      expect(submitButton).toBeDisabled()
    })
  })

  describe("Interaction", () => {
    beforeEach(() => {
      render(<SignupPage />)
    })

    it("enable submit button after typing password and repeat password", () => {
      const pass = screen.getByPlaceholderText("password")
      const passRep = screen.getByPlaceholderText("password repeat")
      userEvent.type(pass, "p4ssword")
      userEvent.type(passRep, "p4ssword")
      const submitBtn = screen.getByRole("button", { name: "Sign up" })
      expect(submitBtn).not.toBeDisabled()
    })

    it("sign in functionality check ", async () => {
      let reqBody
      const server = setupServer(
        rest.post("http://localhost:8080/api/1.0/users", (req, res, ctx) => {
          reqBody = req.body
          return res(ctx.status(200))
        })
      )
      server.listen()
      const username = screen.getByLabelText("Username")
      const email = screen.getByLabelText("Email")
      const pass = screen.getByPlaceholderText("password")
      const passRep = screen.getByPlaceholderText("password repeat")
      userEvent.type(username, "user1")
      userEvent.type(email, "user1@mail.com")
      userEvent.type(pass, "p4ssword")
      userEvent.type(passRep, "p4ssword")
      const submitBtn = screen.getByRole("button", { name: "Sign up" })

      // clicking on submit button
      userEvent.click(submitBtn)

      await new Promise((res) => setTimeout(res, 500))

      expect(reqBody).toEqual({
        username: "user1",
        email: "user1@mail.com",
        password: "p4ssword",
      })
    })
  })
})
