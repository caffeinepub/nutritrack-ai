// Auto-generated stub for NutriTrack AI (client-side only app)
// This file satisfies the platform actor infrastructure

import type { HttpAgent } from "@dfinity/agent";

export interface backendInterface {
  ping: () => Promise<string>;
}

export interface CreateActorOptions {
  agentOptions?: Record<string, unknown>;
  actorOptions?: Record<string, unknown>;
  agent?: HttpAgent;
  processError?: (e: unknown) => never;
}

export class ExternalBlob {
  private bytes: Uint8Array;
  onProgress?: (progress: number) => void;

  constructor(bytes: Uint8Array) {
    this.bytes = bytes;
  }

  static fromURL(url: string): ExternalBlob {
    return new ExternalBlob(new TextEncoder().encode(url));
  }

  async getBytes(): Promise<Uint8Array> {
    return this.bytes;
  }
}

export function createActor(
  _canisterId: string,
  _uploadFile: (file: ExternalBlob) => Promise<Uint8Array>,
  _downloadFile: (bytes: Uint8Array) => Promise<ExternalBlob>,
  _options?: CreateActorOptions,
): backendInterface {
  return {
    ping: async () => "NutriTrack AI v1.0",
  };
}
