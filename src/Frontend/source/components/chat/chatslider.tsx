import React from 'react'

const chatslider = () => {
  return (
    <div className="costum-little-shadow bg-black-crd col-start-1 col-end-3 hidden lg:flex items-center justify-center overflow-hidden rounded-2xl bg-[url('/chat-bg.png')] pb-4 lg:flex-col w-full h-full z-50">
    {/* Headbar */}
    <div className="costum-little-shadow font-dayson flex h-[100px] w-full items-center justify-between bg-[rgb(0,0,0,0.7)] px-4 text-white">
      <div className="flex items-start gap-2 sm:gap-4">
        <div className="flex size-[50px] sm:size-[70px] items-center justify-center rounded-full bg-slate-400">
          {/* <img
            src={chatPartner.avatar}
            alt={`${chatPartner.username}'s profile`}
            className="rounded-full w-full h-full object-cover"
          /> */}
        </div>
        <div>
          {/* <h2 className="text-sm sm:text-base">{chatPartner.username}</h2> */}
          <h3 className="text-xs sm:text-sm text-primary dark:text-primary-dark font-poppins">online</h3>
        </div>
      </div>
    </div>
    {/* Messages */}
    <div className="custom-scrollbar-container flex h-[calc(100vh-200px)] w-full flex-col gap-2 overflow-scroll py-2 px-2">
      {/* {messages.map((message, index) => (
        <MessageBubble
          key={index}
          message={message}
          isCurrentUser={chatPartner.username === message.receiver}
        />
      ))} */}
      {/* <div ref={messagesEndRef} /> */}
    </div>
    {/* Message Input */}
    <form
    //   onSubmit={handleSendMessage}
      className="flex h-[50px] w-full items-center gap-2 rounded-md bg-[rgb(0,0,0,0.7)] px-4 py-1"
    >
      <div className="flex w-full items-center gap-3">
        {/* <FiPlus className="size-[25px] text-white" />
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Start a new conversation"
          className="w-full bg-transparent text-white focus:outline-none text-sm sm:text-base"
        /> */}
      </div>
      <button
        type="submit"
        className="bg-primary dark:bg-primary-dark flex size-[35px] items-center justify-center rounded-md"
      >
        {/* <IoSend className="size-[20px] text-white" /> */}
      </button>
    </form>
  </div>
  
  )
}

export default chatslider