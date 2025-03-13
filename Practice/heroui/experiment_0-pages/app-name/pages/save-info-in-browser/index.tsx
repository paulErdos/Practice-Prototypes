import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Input, Button } from "@heroui/react";
import { useState, useEffect } from "react";

export default function DocsPage() {
  const [userText, setUserText] = useState("");

  useEffect(() => {
    // Retrieve saved text from localStorage
    const savedText = localStorage.getItem("userText");
    if (savedText) setUserText(savedText);
  }, []);

  const handleSaveText = () => {
    // Save text to localStorage
    localStorage.setItem("userText", userText);
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Text Persistence Test</h1>
          <p>Text is saved in localstorage and persists between browser restart.</p>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <Input
            placeholder="Type something..."
            value={userText}
            onChange={(e) => setUserText(e.target.value)}
          />
          <Button color="primary" variant="solid" onPress={handleSaveText}>
            Save Text
          </Button>

          {userText && <p>Saved Text: {userText}</p>}
        </div>
      </section>
    </DefaultLayout>
  );
}
