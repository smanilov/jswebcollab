import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";

import { Component } from "react";

import { basicSetup, EditorView } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>JS Web Collab</title>
        <meta name="description" content="Allows people to run JS scripts from anywhere" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            <span className="text-[hsl(280,100%,70%)]">JS</span> Web Collab
          </h1>
          <div className="flex flex-col items-center gap-2">
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {sessionData && <MainScreen />}
      <div className="text-center text-2xl text-white">
        {(!sessionData) && <p>You would need to sign in to continue</p>}
        {sessionData && <p>Logged in as {sessionData.user?.name}</p>}
      </div>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};

let editorView: EditorView;

class MainScreen extends Component {
  componentDidMount() {
    const parent: Element = document.querySelector('#editor-view')!;

    if (editorView === undefined) {
      // Create editorView and attach to new MainScreen.
      editorView = new EditorView({
        doc: "console.log('hello')\n",
        extensions: [basicSetup, javascript()],
        parent: parent
      });
    } else {
      // Move editorView to new MainScreen.
      parent.appendChild(editorView.dom);
    }
  }

  render() {
    return <div className="flex flex-col items-center justify-center gap-4">
             <div id="editor-view" className="bg-white"></div>
             <button
               className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
               onClick={() => void run()}
             >Run</button>
             <div id="console-output" className="bg-white">
               Output
             </div>
           </div>
  }
}

function jswcConsoleLog(object: any) {
  const previousOutput = document.getElementById('console-output')!.textContent ?? '';
  const newOutput = JSON.stringify(object) + '\n';
  document.getElementById('console-output')!.textContent = previousOutput + newOutput;
}

function run() {
  document.getElementById('console-output')!.textContent = '';

  let code = editorView.state.doc.sliceString(0);
  code = code.replaceAll('console.log', 'jswcConsoleLog');
  console.log(code);
  eval(code);
}
