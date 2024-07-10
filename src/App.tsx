import { Github, Wand2, UserCircle } from "lucide-react";
import { Button } from "./components/ui/button";
import { Separator } from "./components/ui/separator";
import { Textarea } from "./components/ui/textarea";
import { Label } from "./components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Slider } from "./components/ui/slider";
import { VideoInputForm } from "./components/video-input-form";
import { PromptSelect } from "./components/prompt-select";
import { useState } from "react";
import { useCompletion } from "ai/react";

export function App() {
  const [temperatura, setTemperatura] = useState(0.5);
  const [videoId, setVideoId] = useState<String | null>(null);

  const {
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    completion,
    isLoading,
  } = useCompletion({
    api: "https://upload-ai-1xt6.onrender.com/ai/complete",
    body: {
      videoId,
      temperatura,
    },
    headers: {
      "Content-Type": "application/json",
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-6 py-3 gap-1 flex items-center justify-between border-b">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold ">upload.ai</h1>
          <span className="text-xs font-semibold text-muted-foreground/70">
            transcrição de vídeo para aúdio utilizando inteligência artificial
          </span>
        </div>

        <Separator orientation="vertical" className="h-9 md:hidden  mx-4" />

        <div className="flex items-center md:flex-row flex-col gap-3">
          <a href="https://github.com/lucascmpos/upload.ai" target="_blank">
            <Button variant="outline" className="px-4">
              <Github className="w-4 h-4 mr-2" />
              Repositório
            </Button>
          </a>
          <a href="https://lucascampos-portfolio.vercel.app" target="_blank">
            <Button variant="outline" className="px-6">
              <UserCircle className="w-4 h-4 mr-2" />
              Portfólio
            </Button>
          </a>
        </div>
      </div>
      <main className="flex-1 p-6 md:flex  gap-6">
        <div className="flex flex-col flex-1 gap-4">
          <div className="md:grid md:grid-rows-2 flex flex-col gap-4 flex-1">
            <Textarea
              className="md:resize-none p-4 md:h-auto h-32 leading-relaxed"
              placeholder="Inclua o prompt para a IA..."
              value={input}
              onChange={handleInputChange}
            />
            <p className="text-sm md:hidden block  md:mb-0 text-muted-foreground">
              Lembre-se: você deve utilizar a variável{" "}
              <code className="text-violet-400">{"{transcription}"}</code> no
              seu prompt para adicionar o conteúdo da transcrição do vídeo
              carregado, assim podendo comentar sobre o vídeo.
            </p>
            <Textarea
              className="md:resize-none p-4 md:h-auto h-64 leading-relaxed"
              placeholder="Resultado gerado pela IA..."
              readOnly
              value={completion}
            />
          </div>

          <p className="text-sm hidden md:block mb-3 md:mb-0 text-muted-foreground">
            Lembre-se: você pode utilizar a variável{" "}
            <code className="text-violet-400">{"{transcription}"}</code> no seu
            prompt para adicionar o conteúdo da transcrição do vídeo
            selecionado.
          </p>
        </div>
        <aside className="md:w-72  space-y-6">
          <span className="text-xs hidden md:block font-semibold mb-3 md:mb-0 text-muted-foreground/70">
            Você só pode selecionar vídeos que estão baixados no seu
            dispositivo.
          </span>
          <VideoInputForm onVideoUploaded={setVideoId} />
          <span className="text-xs md:hidden block font-semibold mb-3 md:mb-0 text-muted-foreground/70">
            Você só pode selecionar vídeos que estão baixados no seu
            dispositivo.
          </span>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Prompt</Label>
              <PromptSelect onPromptSelected={setInput} />
            </div>

            <div className="space-y-2">
              <Label>Modelo</Label>
              <Select disabled defaultValue="gpt3.5">
                <SelectTrigger>
                  <SelectValue></SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt3.5">GPT 3.5-turbo 16k</SelectItem>
                </SelectContent>
              </Select>
              <span className="block text-xs text-muted-foreground italic">
                Você poderá customizar essa opção em breve
              </span>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label>Temperatura</Label>
              <Slider
                min={0}
                max={1}
                step={0.1}
                value={[temperatura]}
                onValueChange={(value) => setTemperatura(value[0])}
              />

              <span className="block text-xs text-muted-foreground italic leading-relaxed">
                Valores mais altos tendem a deixar o resultado mais criativo e
                com possíveis erros.
              </span>
            </div>

            <Separator />

            <Button disabled={isLoading} type="submit" className="w-full">
              Executar
              <Wand2 className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </aside>
      </main>
    </div>
  );
}
