import { useEffect, useState } from "react";
import StoryblokClient from "storyblok-js-client";

const Storyblok = new StoryblokClient({
  accessToken: "zkIN0LpmC5SrPsjxMu4rOQtt",
  cache: {
    clear: "auto",
    type: "memory",
  },
});

export function useStoryblok(originalStory, preview, locale) {
  let [story, setStory] = useState(originalStory);

  // визуал засварлагчийг шинэчлэх үйл явдлуудыг нэмдэг
  // харах https://www.storyblok.com/docs/guide/essentials/visual-editor#initializing-the-storyblok-js-bridge
  function initEventListeners() {
    const { StoryblokBridge } = window;
    if (typeof StoryblokBridge !== "undefined") {
      // гүүрийг өөрийн токеноор эхлүүлнэ үү
      const storyblokInstance = new StoryblokBridge({
        resolveRelations: ["featured-posts.posts", "selected-posts.posts"],
        language: locale,
      });

      // Visual Editor-д үйл явдлыг хадгалах эсвэл нийтлэхийн тулд Next.js хуудсан дээр дахин ачаална уу
      storyblokInstance.on(["change", "published"], () =>
        location.reload(true)
      );

      // оролтын үйл явдлын тухай түүхийг шууд шинэчлэх
      storyblokInstance.on("input", (event) => {
        if (story && event.story._uid === story._uid) {
          setStory(event.story);
        }
      });

      storyblokInstance.on("enterEditmode", (event) => {
        // loading the draft version on initial enter of editor
        Storyblok.get(`cdn/stories/${event.storyId}`, {
          version: "draft",
          resolve_relations: ["featured-posts.posts", "selected-posts.posts"],
          language: locale,
        })
          .then(({ data }) => {
            if (data.story) {
              setStory(data.story);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      });
    }
  }

  // гүүр скрипт хаягийг манай баримт бичигт хавсаргана
  // see https://www.storyblok.com/docs/guide/essentials/visual-editor#installing-the-storyblok-js-bridge
  function addBridge(callback) {
    // check if the script is already present
    const existingScript = document.getElementById("storyblokBridge");
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "//app.storyblok.com/f/storyblok-v2-latest.js";
      script.id = "storyblokBridge";
      document.body.appendChild(script);
      script.onload = () => {
        // once the scrip is loaded, init the event listeners
        callback();
      };
    } else {
      callback();
    }
  }

  useEffect(() => {
    // зөвхөн урьдчилан харах горимд ачаална
    if (preview) {
      // эхлээд гүүрийг ачаалж, дараа нь үйл явдлын сонсогчдыг эхлүүлнэ
      addBridge(initEventListeners);
    }
  }, []);

  useEffect(() => {
    setStory(originalStory);
  }, [originalStory]);

  return story;
}

export default Storyblok;
