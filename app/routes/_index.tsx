import type { MetaFunction } from "@remix-run/node";
import CustomTextArea from "../components/TextEditor"

export const meta: MetaFunction = () => {
  return [
    { title: "offo Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
   <div>
  
    <CustomTextArea />
   </div>
  );
}
