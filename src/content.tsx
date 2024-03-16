import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

import icon from "../assets/frame.png"
import generate from "../assets/generate.png"
import insert from "../assets/insert.png"
import regenerate from "../assets/regenerate.png"

export const config: PlasmoCSConfig = {
  matches: ["https://*.linkedin.com/*"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

// top: 530px; left: 622px; position: absolute; transform: translate(-100%, -100%); z-index: 2147483644;
const PlasmoOverlay = () => {
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    height: 0,
    width: 0
  })
  const [isFocused, setIsFocused] = useState(false)
  const [aiModel, setAIModel] = useState(false)
  const [userText, setUserText] = useState("")
  const [chats, setChats] = useState(false)
  const [element, setElement] = useState(null)

  const handleInsert = () => {
    setChats(!chats)
    setUserText("")
    if (element) {
      const pTag = element.querySelector("p")
      pTag.textContent = `Thank you for the opportunity! If you have any more
      questions or if there's anything else I can help you with,
      feel free to ask.`
    }
  }

  useEffect(() => {
    const handleClick = () => {
      const elements = document.querySelector(
        'div[aria-label="Write a message…"]'
      )
      if (elements) {
        setElement(elements)
        const rect = elements.getBoundingClientRect()
        setPosition({
          top: rect.top,
          left: rect.left,
          height: rect.height,
          width: rect.width
        })
        setIsFocused(true)
      } else {
        setIsFocused(false)
      }
    }

    document.body.addEventListener("click", handleClick)

    return () => {
      document.body.removeEventListener("click", handleClick)
    }
  }, [])

  return (
    <>
      {isFocused && !aiModel && (
        <div
          style={{
            position: "fixed",
            top: position.top + position.height + "px",
            left: position.left + position.width + "px",
            zIndex: 99999,
            transform: "translate(-100%, -100%)",
            cursor: "pointer"
          }}>
          <img
            src={icon}
            alt="Chat Icon"
            onClick={() => setAIModel(!aiModel)}
          />
        </div>
      )}
      {aiModel && (
        <div
          className="fixed inset-0 z-50"
          style={{
            top: !chats ? position.top - 100 + "px" : position.top - 200 + "px",
            left: position.left + "px"
          }}>
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setAIModel(!aiModel)}></div>
          <div
            className="relative bg-[#F9FAFB] flex flex-col p-3 rounded-lg"
            style={{
              width: position.width + 20 + "px"
            }}>
            {chats && (
              <div className="flex flex-col space-y-3 mb-3 text-[#666D80]">
                <div className="flex justify-end">
                  <div
                    className="bg-[#DFE1E7] p-2 rounded-lg"
                    style={{ width: position.width - 50 + "px" }}>
                    <p>{userText}</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div
                    className="bg-[#DBEAFE] p-2 rounded-lg"
                    style={{ width: position.width - 50 + "px" }}>
                    <p>
                      Thank you for the opportunity! If you have any more
                      questions or if there's anything else I can help you with,
                      feel free to ask.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <input
              placeholder="Your prompt"
              type="text"
              className="border p-3 rounded-lg mb-5 placeholder:text-[#A4ACB9] border-[#C1C7D0]"
              value={!chats ? userText : ""}
              onChange={(e) => setUserText(e.target.value)}
            />
            <div className="flex justify-end">
              {!chats ? (
                <button
                  type="button"
                  className="flex items-center space-x-2 text-md bg-[#3B82F6] rounded-lg px-4 py-2 w-fit border border-[#3B82F6]"
                  onClick={() => userText !== "" && setChats(!chats)}>
                  <img src={generate} alt="Generate" width={14} />
                  <span className="text-white font-semibold text-lg">
                    Generate
                  </span>
                </button>
              ) : (
                <div className="flex space-x-5">
                  <button
                    type="button"
                    className="flex items-center space-x-2 text-md rounded-lg px-4 py-2 w-fit border border-[#666D80]"
                    onClick={() => handleInsert()}>
                    <img src={insert} alt="Generate" width={12} />
                    <span className="text-[#666D80] font-semibold text-lg">
                      Insert
                    </span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center space-x-2 text-md bg-[#3B82F6] rounded-lg px-4 py-2 w-fit border border-[#3B82F6]">
                    {" "}
                    <img src={regenerate} alt="Generate" width={12} />
                    <span className="text-white font-semibold text-lg">
                      Regenerate
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PlasmoOverlay
