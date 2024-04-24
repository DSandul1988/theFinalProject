"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";

import { pusherClient } from "@/app/libs/pusher";
import useConversations from "@/app/hooks/useConversations";
import { find } from "lodash";
import { FullMessageType } from "@/app/types";
import MessageBox from "./MessageBox";

interface BodyProps {
  // An array of message objects to initialize the component with.
  initialMessages: FullMessageType[];
}

const Body: React.FC<BodyProps> = ({ initialMessages = [] }) => {
  // Create a ref object to point to the bottom of the message list for auto-scrolling.
  const bottomRef = useRef<HTMLDivElement>(null);
  // Initialize the 'messages' state with 'initialMessages'.
  const [messages, setMessages] = useState(initialMessages);
  // Use a custom hook 'useConversations' to obtain the current conversation ID.
  const { conversationId } = useConversations();

  // Mark the conversation as seen by sending a POST request.
  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]); // Re-run this effect when 'conversationId' changes.

  useEffect(() => {
    // Subscribe to the conversation's channel using Pusher.
    pusherClient.subscribe(conversationId);
    // Scroll to the bottom of the message list when the component mounts or updates.
    bottomRef?.current?.scrollIntoView();
    // Define a handler for receiving new messages.
    const messageHandler = (message: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}`);
      // Add the new message to the state, ensuring it's not a duplicate.
      setMessages((current) => {
        if (find(current, { id: message.id })) {
          // If the message is already present, don't add it again.
          return current;
        }
        // Add the new message to the messages array.
        return [...current, message];
      });
      // Scroll to the bottom after adding the new message.
      bottomRef?.current?.scrollIntoView();
    };

    // Define a handler for updating messages.
    const updateMessageHandler = (newMessage: FullMessageType) => {
      // Update the message in the state with the new message details.
      setMessages((current) =>
        current.map((currentMessage) => {
          if (currentMessage.id === newMessage.id) {
            // Replace the message with the updated message.
            return newMessage;
          }

          return currentMessage;
        })
      );
    };
    // Bind the handlers to the appropriate Pusher events.
    pusherClient.bind("messages:new", messageHandler);
    pusherClient.bind("message:update", updateMessageHandler);
    // Cleanup function to unsubscribe and
    //unbind handlers when the component unmounts or 'conversationId' changes.
    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("messages:new", messageHandler);
      pusherClient.unbind("message:update", updateMessageHandler);
    };
  }, [conversationId]);

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, i) => (
        <MessageBox
          isLast={i === messages.length - 1}
          key={message.id}
          data={message}
        />
      ))}
      <div className="pt-24" ref={bottomRef} />
    </div>
  );
};

export default Body;
