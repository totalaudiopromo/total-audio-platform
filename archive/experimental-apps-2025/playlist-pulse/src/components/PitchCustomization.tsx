'use client';
import { useState } from 'react';
import { Users, Wand2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApp } from '@/context/AppContext';

export default function PitchCustomization() {
  const { state, dispatch } = useApp();
  const [isGenerating, setIsGenerating] = useState(false);

  const updatePitchSetting = (key: string, value: number[]) => {
    dispatch({
      type: 'UPDATE_PITCH_SETTINGS',
      payload: { [key]: value },
    });
  };

  const generatePitches = async () => {
    setIsGenerating(true);

    // Simulate pitch generation with loading time
    setTimeout(() => {
      dispatch({ type: 'SET_SHOW_RESULTS', payload: true });
      setIsGenerating(false);
    }, 2000);
  };

  const generatePreviewPitch = () => {
    const { professionalism, enthusiasm, creativity, personalTouch } = state.pitchSettings;

    let pitch = 'Hi [Curator Name]! ';

    // Adjust greeting based on enthusiasm
    if (enthusiasm[0] > 70) {
      pitch = "Hey [Curator Name]! I'm absolutely thrilled to reach out because ";
    } else if (enthusiasm[0] < 40) {
      pitch = 'Dear [Curator Name], I hope this message finds you well. ';
    }

    // Core message based on professionalism
    if (professionalism[0] > 70) {
      pitch +=
        "I've been following your [Playlist Name] and deeply appreciate your curatorial expertise in the [Genre] space. ";
    } else {
      pitch +=
        "I've been vibing with your [Playlist Name] playlist and love your taste in [Genre] music! ";
    }

    // Personal touch
    if (personalTouch[0] > 60) {
      pitch +=
        'Your track selection demonstrates a clear understanding of what your [Follower Count] followers connect with emotionally. ';
    }

    // Creative elements based on creativity setting
    if (creativity[0] > 70) {
      pitch +=
        'My latest track is a sonic journey that weaves [Musical Elements] with unexpected twists that I believe would create those perfect playlist moments your audience craves. ';
    } else {
      pitch +=
        "My latest track combines [Musical Elements] that would fit perfectly with your playlist's aesthetic. ";
    }

    // Professional closing
    if (professionalism[0] > 60) {
      pitch +=
        "I'd be honored to have you consider it for inclusion. Thank you for your time and for the incredible work you do in music discovery.";
    } else {
      pitch += 'Would love for you to check it out and see if it vibes with your playlist!';
    }

    return pitch;
  };

  return (
    <Card className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
      <CardContent className="p-0">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Pitch Customization</h2>

        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/10 rounded-xl p-1 mb-8">
            <TabsTrigger
              value="settings"
              className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white rounded-lg"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Pitch Settings
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white rounded-lg"
            >
              <Send className="w-4 h-4 mr-2" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="text-white font-medium mb-3 block">
                    Professionalism
                    <span className="text-white/60 text-sm ml-2">
                      ({state.pitchSettings.professionalism[0]}%)
                    </span>
                  </label>
                  <Slider
                    value={state.pitchSettings.professionalism}
                    onValueChange={value => updatePitchSetting('professionalism', value)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-white/60 text-xs mt-1">
                    Formal tone and structured approach
                  </div>
                </div>

                <div>
                  <label className="text-white font-medium mb-3 block">
                    Enthusiasm
                    <span className="text-white/60 text-sm ml-2">
                      ({state.pitchSettings.enthusiasm[0]}%)
                    </span>
                  </label>
                  <Slider
                    value={state.pitchSettings.enthusiasm}
                    onValueChange={value => updatePitchSetting('enthusiasm', value)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-white/60 text-xs mt-1">Energy and excitement level</div>
                </div>

                <div>
                  <label className="text-white font-medium mb-3 block">
                    Creativity
                    <span className="text-white/60 text-sm ml-2">
                      ({state.pitchSettings.creativity[0]}%)
                    </span>
                  </label>
                  <Slider
                    value={state.pitchSettings.creativity}
                    onValueChange={value => updatePitchSetting('creativity', value)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-white/60 text-xs mt-1">Unique and creative language</div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-white font-medium mb-3 block">
                    Urgency
                    <span className="text-white/60 text-sm ml-2">
                      ({state.pitchSettings.urgency[0]}%)
                    </span>
                  </label>
                  <Slider
                    value={state.pitchSettings.urgency}
                    onValueChange={value => updatePitchSetting('urgency', value)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-white/60 text-xs mt-1">Time-sensitive language</div>
                </div>

                <div>
                  <label className="text-white font-medium mb-3 block">
                    Personal Touch
                    <span className="text-white/60 text-sm ml-2">
                      ({state.pitchSettings.personalTouch[0]}%)
                    </span>
                  </label>
                  <Slider
                    value={state.pitchSettings.personalTouch}
                    onValueChange={value => updatePitchSetting('personalTouch', value)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-white/60 text-xs mt-1">
                    Personalized details and research
                  </div>
                </div>

                <div>
                  <label className="text-white font-medium mb-3 block">
                    Data Focus
                    <span className="text-white/60 text-sm ml-2">
                      ({state.pitchSettings.dataFocus[0]}%)
                    </span>
                  </label>
                  <Slider
                    value={state.pitchSettings.dataFocus}
                    onValueChange={value => updatePitchSetting('dataFocus', value)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-white/60 text-xs mt-1">Statistics and metrics emphasis</div>
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <Button
                onClick={generatePitches}
                disabled={isGenerating}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-12 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Generating Pitches...
                  </>
                ) : (
                  'Generate Personalized Pitches'
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <div>
              <label className="text-white font-medium mb-3 block">Live Pitch Preview</label>
              <div className="bg-white/5 rounded-xl p-6 text-white/80 text-sm leading-relaxed border border-white/10">
                {generatePreviewPitch()}
              </div>
              <div className="text-white/60 text-xs mt-2">
                This preview updates in real-time as you adjust your settings
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-white font-medium mb-2">Pitch Tone</div>
                <div className="text-white/70 text-sm">
                  {state.pitchSettings.professionalism[0] > 70
                    ? 'Very Professional'
                    : state.pitchSettings.professionalism[0] > 40
                    ? 'Balanced'
                    : 'Casual & Friendly'}
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-white font-medium mb-2">Expected Response</div>
                <div className="text-white/70 text-sm">
                  {(state.pitchSettings.professionalism[0] + state.pitchSettings.personalTouch[0]) /
                    2 >
                  60
                    ? 'High'
                    : 'Medium'}{' '}
                  Response Rate
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button
                onClick={generatePitches}
                disabled={isGenerating}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              >
                Generate with These Settings
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
