import React from "react";

const WelcomeBoard: React.FC = () => {
    return (
        <>
            <div className="text-center p-4 mx-auto mt-8">
                <h1 className="font-bold text-2xl">Welcome to your workspace management.</h1>
                <h5 className="text-lg mt-4">Please select or create the board from sidebar to start 😊</h5>
            </div>
        </>
    )
}

export default WelcomeBoard;