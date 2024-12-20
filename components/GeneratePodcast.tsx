/*import { GeneratePodcastProps } from '@/types'
import React, { useState } from 'react'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Loader } from 'lucide-react'
import { useAction, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/components/ui/use-toast"

import { useUploadFiles } from '@xixixao/uploadstuff/react';

const useGeneratePodcast = ({
  setAudio, voiceType, voicePrompt, setAudioStorageId
}: GeneratePodcastProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast()

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl)

  const getPodcastAudio = useAction(api.openai.generateAudioAction)

  const getAudioUrl = useMutation(api.podcasts.getUrl);

  const generatePodcast = async () => {
    setIsGenerating(true);
    setAudio('');

    if(!voicePrompt) {
      toast({
        title: "Please provide a voiceType to generate a podcast",
      })
      return setIsGenerating(false);
    }

    try {
      const response = await getPodcastAudio({
        voice: voiceType,
        input: voicePrompt
      })

      const blob = new Blob([response], { type: 'audio/mpeg' });
      const fileName = `podcast-${uuidv4()}.mp3`;
      const file = new File([blob], fileName, { type: 'audio/mpeg' });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      setAudioStorageId(storageId);

      const audioUrl = await getAudioUrl({ storageId });
      setAudio(audioUrl!);
      setIsGenerating(false);
      toast({
        title: "Podcast generated successfully",
      })
    } catch (error) {
      console.log('Error generating podcast', error)
      toast({
        title: "Error creating a podcast",
        variant: 'destructive',
      })
      setIsGenerating(false);
    }
    
  }

  return { isGenerating, generatePodcast }
}

const GeneratePodcast = (props: GeneratePodcastProps) => {
  const { isGenerating, generatePodcast } = useGeneratePodcast(props);

  return (
    <div>
      <div className="flex flex-col gap-2.5">
        <Label className="text-16 font-bold text-white-1">
          AI Prompt to generate Podcast
        </Label>
        <Textarea 
          className="input-class font-light focus-visible:ring-offset-orange-1"
          placeholder='Provide text to generate audio'
          rows={5}
          value={props.voicePrompt}
          onChange={(e) => props.setVoicePrompt(e.target.value)}
        />
      </div>
      <div className="mt-5 w-full max-w-[200px]">
      <Button type="submit" className="text-16 bg-orange-1 py-4 font-bold text-white-1" onClick={generatePodcast}>
        {isGenerating ? (
          <>
            Generating
            <Loader size={20} className="animate-spin ml-2" />
          </>
        ) : (
          'Generate'
        )}
      </Button>
      </div>
      {props.audio && (
        <audio 
          controls
          src={props.audio}
          autoPlay
          className="mt-5"
          onLoadedMetadata={(e) => props.setAudioDuration(e.currentTarget.duration)}
        />
      )}
    </div>
  )
}

export default GeneratePodcast

*/

/** 
import { GeneratePodcastProps } from '@/types'
import React, { useState } from 'react'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Loader } from 'lucide-react'
import { useAction, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/components/ui/use-toast"
import { cn } from '@/lib/utils';

import { useUploadFiles } from '@xixixao/uploadstuff/react';

const useGeneratePodcast = ({
  setAudio, voiceType, voicePrompt, setAudioStorageId
}: GeneratePodcastProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast()

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl)

  // const getPodcastAudio = useAction(api.openai.generateAudioAction)
  // const getPodcastAudio = useAction(api.elevenlabs.generateAudioAction)

  const getAudioUrl = useMutation(api.podcasts.getUrl);

  const generatePodcast = async () => {
    setIsGenerating(true);
    setAudio('');

    if(!voicePrompt) {
      toast({
        title: "Please provide a voiceType to generate a podcast",
      })
      return setIsGenerating(false);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/elevenlabs`, { 
        method: 'POST',
        body: JSON.stringify({
            input: voicePrompt,
            voice: voiceType
        })
      })

      // const response = await getPodcastAudio({
      //   input: voicePrompt,
      //   voice: voiceType
      // })

      // const blob = new Blob([response], { type: 'audio/mpeg' });
      const blob = await response.blob();  // Convert the response to a Blob
      const fileName = `podcast-${uuidv4()}.mp3`;
      const file = new File([blob], fileName, { type: 'audio/mpeg' });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      setAudioStorageId(storageId);

      const audioUrl = await getAudioUrl({ storageId });
      setAudio(audioUrl!);
      setIsGenerating(false);
      toast({
        title: "Podcast generated successfully",
      })
    } catch (error) {
      console.log('Error generating podcast', error)
      toast({
        title: "Error creating a podcast",
        variant: 'destructive',
      })
      setIsGenerating(false);
    }
    
  }

  return { isGenerating, generatePodcast }
}

const GeneratePodcast = (props: GeneratePodcastProps) => {
  const { isGenerating, generatePodcast } = useGeneratePodcast(props);

  return (
    <div>
      <div className="flex flex-col gap-2.5">
        <Label className="text-16 font-bold text-white-1">
          AI Prompt to generate Podcast
        </Label>
        <Textarea 
          className="input-class font-light focus-visible:ring-offset-orange-1"
          placeholder='Provide text to generate audio'
          rows={5}
          value={props.voicePrompt}
          onChange={(e) => props.setVoicePrompt(e.target.value)}
        />
      </div>
      <div className="mt-5 w-full max-w-[200px]">
      <Button type="button" className="text-16 bg-orange-1 py-4 font-bold text-white-1" onClick={generatePodcast}>
        {isGenerating ? (
          <>
            Generating
            <Loader size={20} className="animate-spin ml-2" />
          </>
        ) : (
          'Generate'
        )}
      </Button>
      </div>
      {props.audio && (
        <audio 
          controls
          src={props.audio}
          autoPlay
          className="mt-5"
          onLoadedMetadata={(e) => props.setAudioDuration(e.currentTarget.duration)}
        />
      )}
    </div>
  )
}

export default GeneratePodcast

*/



import { GeneratePodcastProps } from '@/types';
import React, { useRef, useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from 'convex/react';
import { useUploadFiles } from '@xixixao/uploadstuff/react';
import { api } from '@/convex/_generated/api';
import { v4 as uuidv4 } from 'uuid';
import { Label } from './ui/label';
import { Loader } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';



const GeneratePodcast: React.FC<GeneratePodcastProps> = ({
  setAudio,
  setAudioStorageId,
  voicePrompt,
  setVoicePrompt,
  audio,
  voiceType,
}) => {
  const [isAiAudio, setIsAiAudio] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const audioRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();


  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);
  const getAudioUrl = useMutation(api.podcasts.getUrl);

  // Helper function to handle uploading the audio file
  const handleAudio = async (blob: Blob, fileName: string) => {
    setIsAudioLoading(true);
    setAudio('');

    try {
      const file = new File([blob], fileName, { type: 'audio/mpeg' });
      console.log("Uploading file:", fileName);

      const uploaded = await startUpload([file]);
      if (!uploaded || !uploaded[0] || !uploaded[0].response) {
        throw new Error('File upload failed');
      }

      const storageId = (uploaded[0].response as any).storageId;
      console.log("Generated Storage ID:", storageId);

      setAudioStorageId(storageId);

      const audioUrl = await getAudioUrl({ storageId });
      console.log("Generated Audio URL:", audioUrl);

      if (!audioUrl) {
        throw new Error("Failed to retrieve audio URL");
      }

      setAudio(audioUrl!);
      setIsAudioLoading(false);
      toast({
        title: "Podcast audio generated successfully",
      });
    } catch (error) {
      console.log(error);
      toast({ title: 'Error generating audio', variant: 'destructive' });
    }
  };

  // Function to generate audio using ElevenLabs API
  const generateAudio = async () => {
    if (!voiceType || !voicePrompt) {
      console.log("Voice type or prompt missing");
      return;
    }
    if (!voicePrompt || voicePrompt.trim() === "") {
      toast({
        title: "Please provide an audio prompt",
        variant: "destructive",
      });
      return;
    }
  
    setIsAudioLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/elevenlabs`, {
        method: 'POST',
        body: JSON.stringify({
          input: voicePrompt,
          voice: voiceType,
      })
      })
           
      if (!response.ok) {
        throw new Error('Error generating audio from ElevenLabs API');
      }

      const audioBlob = await response.blob(); // Convert the response to Blob
      handleAudio(audioBlob, `podcast-${uuidv4()}.mp3`);
    } catch (error) {
      console.log(error);
      toast({ title: 'Error generating audio', variant: 'destructive' });
    } finally {
      setIsAudioLoading(false);
    }
  };

  const uploadAudio = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    try {
      const files = e.target.files;
      if (!files) return;
      const file = files[0];
      const blob = await file.arrayBuffer().then((ab) => new Blob([ab]));

      handleAudio(blob, file.name);
    } catch (error) {
      console.log(error);
      toast({ title: 'Error uploading audio', variant: 'destructive' });
    }
  };

  return (
    <>
      <div className="generate_podcast">
        <Button
          type="button"
          variant="plain"
          onClick={() => setIsAiAudio(true)}
          className={cn('', {
            'bg-black-6': isAiAudio
          })}
        >
          Use AI to generate Podcast
        </Button>
        <Button
          type="button"
          variant="plain"
          onClick={() => setIsAiAudio(false)}
          className={cn('', {
            'bg-black-6': !isAiAudio
          })}
        >
          Upload custom audio
        </Button>
      </div>
      {isAiAudio ? (
        <div className="flex flex-col gap-5">
          <div className="mt-5 flex flex-col gap-2.5">
            <Label className="text-16 font-bold text-white-1">
              AI Prompt to generate Podcast
            </Label>
            <Textarea
              className="input-class font-light focus-visible:ring-offset-orange-1"
              placeholder='Provide text to generate podcast audio'
              rows={5}
              value={voicePrompt}
              onChange={(e) => setVoicePrompt(e.target.value)}
            />
          </div>
          <div className="w-full max-w-[200px]">
            <Button
              type="submit"
              className="text-16 bg-red-500 py-4 font-bold text-white-1"
              onClick={generateAudio}
            >
              {isAudioLoading ? (
                <>
                  Generating
                  <Loader size={20} className="animate-spin ml-2" />
                </>
              ) : (
                'Generate'
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="image_div" onClick={() => audioRef?.current?.click()}>
          <Input
            type="file"
            className="hidden"
            ref={audioRef}
            onChange={(e) => uploadAudio(e)}
          />
          {!isAudioLoading ? (
            <Image src="/icons/upload-image.svg" width={40} height={40} alt="upload" />
          ) : (
            <div className="text-16 flex-center font-medium text-white-1">
              Uploading
              <Loader size={20} className="animate-spin ml-2" />
            </div>
          )}
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-12 font-bold text-red-500">
              Click to upload
            </h2>
            <p className="text-12 font-normal text-gray-1">MP3, WAV (max. 100MB)</p>
          </div>
        </div>
      )}
      {audio && (
        <div className="flex-center w-full">
          <audio controls src={audio} autoPlay className="mt-5">
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </>
  );
};

export default GeneratePodcast;

