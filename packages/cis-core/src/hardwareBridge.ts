/**
 * Hardware Bridge - Stub for future Ableton Push 2 integration
 *
 * This is a placeholder for future hardware integration.
 * When implemented, this will allow CIS to communicate with
 * Ableton Push 2 for tactile creative control.
 */

export interface HardwareDevice {
  id: string;
  name: string;
  type: 'push2' | 'midi' | 'osc';
  connected: boolean;
}

export interface HardwareEvent {
  deviceId: string;
  type: 'button' | 'encoder' | 'pad' | 'touchstrip';
  control: string;
  value: number;
  timestamp: number;
}

export interface HardwareDisplay {
  deviceId: string;
  lines: string[];
  colors?: string[];
}

/**
 * Hardware Bridge for external device integration
 * Currently a stub - will be implemented when hardware integration is needed
 */
export class HardwareBridge {
  private devices: Map<string, HardwareDevice> = new Map();
  private eventHandlers: Map<string, (event: HardwareEvent) => void> = new Map();

  /**
   * Scan for connected hardware devices
   * @returns List of available devices
   */
  async scanDevices(): Promise<HardwareDevice[]> {
    // Stub implementation
    console.log('[HardwareBridge] Scanning for devices... (stub)');
    return [];
  }

  /**
   * Connect to a hardware device
   * @param deviceId Device identifier
   * @returns Success status
   */
  async connect(deviceId: string): Promise<boolean> {
    // Stub implementation
    console.log(`[HardwareBridge] Connecting to device ${deviceId}... (stub)`);
    return false;
  }

  /**
   * Disconnect from a hardware device
   * @param deviceId Device identifier
   * @returns Success status
   */
  async disconnect(deviceId: string): Promise<boolean> {
    // Stub implementation
    console.log(`[HardwareBridge] Disconnecting from device ${deviceId}... (stub)`);
    return true;
  }

  /**
   * Register event handler for hardware events
   * @param eventType Type of event to listen for
   * @param handler Event handler function
   */
  onEvent(eventType: string, handler: (event: HardwareEvent) => void): void {
    // Stub implementation
    console.log(`[HardwareBridge] Registered handler for ${eventType} (stub)`);
    this.eventHandlers.set(eventType, handler);
  }

  /**
   * Update hardware display (e.g., Push 2 screen)
   * @param display Display content
   */
  async updateDisplay(display: HardwareDisplay): Promise<void> {
    // Stub implementation
    console.log('[HardwareBridge] Updating display... (stub)', display);
  }

  /**
   * Send MIDI message to device
   * @param deviceId Device identifier
   * @param message MIDI message bytes
   */
  async sendMIDI(deviceId: string, message: number[]): Promise<void> {
    // Stub implementation
    console.log(`[HardwareBridge] Sending MIDI to ${deviceId}:`, message, '(stub)');
  }

  /**
   * Get list of connected devices
   * @returns List of connected devices
   */
  getConnectedDevices(): HardwareDevice[] {
    return Array.from(this.devices.values()).filter((d) => d.connected);
  }

  /**
   * Check if a specific device is connected
   * @param deviceId Device identifier
   * @returns Connection status
   */
  isConnected(deviceId: string): boolean {
    const device = this.devices.get(deviceId);
    return device?.connected || false;
  }
}

/**
 * Create a new hardware bridge instance
 * @returns HardwareBridge instance
 */
export function createHardwareBridge(): HardwareBridge {
  return new HardwareBridge();
}

/**
 * Push 2 specific utilities
 * Placeholder for future Ableton Push 2 integration
 */
export class Push2Bridge extends HardwareBridge {
  /**
   * Map CIS color palette to Push 2 pad colors
   * @param colors Array of hex colors
   */
  async setPadColors(colors: string[]): Promise<void> {
    console.log('[Push2Bridge] Setting pad colors... (stub)', colors);
  }

  /**
   * Display project info on Push 2 screen
   * @param projectName Project name
   * @param context Additional context
   */
  async displayProjectInfo(projectName: string, context: Record<string, any>): Promise<void> {
    console.log('[Push2Bridge] Displaying project info... (stub)', {
      projectName,
      context,
    });
  }

  /**
   * Map encoder to parameter control
   * @param encoderId Encoder identifier (1-8)
   * @param parameter Parameter name
   * @param callback Value change callback
   */
  mapEncoder(
    encoderId: number,
    parameter: string,
    callback: (value: number) => void
  ): void {
    console.log(`[Push2Bridge] Mapping encoder ${encoderId} to ${parameter} (stub)`);
  }
}

/**
 * Create a new Push 2 bridge instance
 * @returns Push2Bridge instance
 */
export function createPush2Bridge(): Push2Bridge {
  return new Push2Bridge();
}
