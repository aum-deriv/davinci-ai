interface LangflowResponse {
  outputs: Array<{
    outputs: Array<{
      outputs: {
        message: {
          text: string;
        };
      };
      artifacts?: {
        stream_url?: string;
      };
    }>;
  }>;
}

export class LangflowClient {
  private baseURL: string;
  private applicationToken: string;

  constructor(baseURL: string, applicationToken: string) {
    this.baseURL = baseURL;
    this.applicationToken = applicationToken;
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  }

  async post(endpoint: string, body: unknown, headers: Record<string, string> = {"Content-Type": "application/json"}) {
    headers["Authorization"] = `Bearer ${this.applicationToken}`;
    headers["Content-Type"] = "application/json";
    const url = `${this.baseURL}${endpoint}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
      });

      const responseMessage = await response.json();
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText} - ${JSON.stringify(responseMessage)}`);
      }
      return responseMessage;
    } catch (error) {
      console.error('Request Error:', error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  async initiateSession(
    flowId: string,
    langflowId: string,
    inputValue: string,
    inputType = 'chat',
    outputType = 'chat',
    stream = false,
    tweaks = {}
  ) {
    const endpoint = `/lf/${langflowId}/api/v1/run/${flowId}?stream=${stream}`;
    const input_value =  inputValue
   

    return this.post(endpoint, { input_value, input_type: inputType, output_type: outputType, tweaks: tweaks });
  }

  handleStream(
    streamUrl: string,
    onUpdate: (data: { chunk?: string }) => void,
    onClose: (message: string) => void,
    onError: (error: unknown) => void
  ) {
    const eventSource = new EventSource(streamUrl);

    eventSource.onmessage = event => {
      const data = JSON.parse(event.data);
      onUpdate(data);
    };

    eventSource.onerror = event => {
      console.error('Stream Error:', event);
      onError(event);
      eventSource.close();
    };

    eventSource.addEventListener("close", () => {
      onClose('Stream closed');
      eventSource.close();
    });

    return eventSource;
  }

  async runFlow(
    flowIdOrName: string,
    langflowId: string,
    inputValue: string,
    inputType = 'chat',
    outputType = 'chat',
    tweaks = {},
    stream = false,
    onUpdate?: (data: { chunk?: string }) => void,
    onClose?: (message: string) => void,
    onError?: (error: unknown) => void
  ): Promise<LangflowResponse> {
    try {
      const initResponse = await this.initiateSession(
        flowIdOrName,
        langflowId,
        inputValue,
        inputType,
        outputType,
        stream,
        tweaks
      );
      console.log('Init Response:', initResponse);
      if (stream && 
          initResponse?.outputs?.[0]?.outputs?.[0]?.artifacts?.stream_url && 
          onUpdate && onClose && onError) {
        const streamUrl = initResponse.outputs[0].outputs[0].artifacts.stream_url;
        console.log(`Streaming from: ${streamUrl}`);
        this.handleStream(streamUrl, onUpdate, onClose, onError);
      }
      return initResponse;
    } catch (error) {
      console.error('Error running flow:', error);
      if (onError) {
        onError('Error initiating session');
      }
      throw error;
    }
  }

  async runFlowWithImage(
    flowIdOrName: string,
    langflowId: string,
    inputValue: string,
    image: File,
    inputType = 'chat',
    outputType = 'chat',
    tweaks = {},
    stream = false,
    onUpdate?: (data: { chunk?: string }) => void,
    onClose?: (message: string) => void,
    onError?: (error: unknown) => void
  ): Promise<LangflowResponse> {
    try {
      const base64Image = await this.fileToBase64(image);
      const input_value = `${inputValue}\n[{"type":"text","text":"Here's the image:"},{"type":"image_url","image_url":{"url":"${base64Image}"}}]`;

      return this.runFlow(
        flowIdOrName,
        langflowId,
        input_value,
        inputType,
        outputType,
        tweaks,
        stream,
        onUpdate,
        onClose,
        onError
      );
    } catch (error) {
      console.error('Error running flow with image:', error);
      if (onError) {
        onError('Error initiating session');
      }
      throw error;
    }
  }
}
