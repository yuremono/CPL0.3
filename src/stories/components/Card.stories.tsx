import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Card
export const Default: Story = {
  render: () => (
    <Card className="w-80 border-2 border-black shadow-[4px_4px_0_0_#0A0A0A]">
      <CardHeader className="border-b-2 border-black p-6">
        <CardTitle className="text-xl font-bold">Card Title</CardTitle>
        <CardDescription className="text-gray-600 mt-2">
          Card description goes here
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <p className="text-base">
          This is the card content area where you can put any content you need.
        </p>
      </CardContent>
    </Card>
  ),
};

// Card with Footer
export const WithFooter: Story = {
  render: () => (
    <Card className="w-80 border-2 border-black shadow-[4px_4px_0_0_#0A0A0A]">
      <CardHeader className="border-b-2 border-black p-6">
        <CardTitle className="text-xl font-bold">Feature Card</CardTitle>
        <CardDescription className="text-gray-600 mt-2">
          With action buttons
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <p className="text-base">
          This card has a footer with action buttons.
        </p>
      </CardContent>
      <CardFooter className="border-t-2 border-black p-6 flex gap-3">
        <Button variant="secondary" size="sm">Cancel</Button>
        <Button variant="primary" size="sm">Confirm</Button>
      </CardFooter>
    </Card>
  ),
};

// Hoverable Card
export const Hoverable: Story = {
  render: () => (
    <Card className="w-80 border-2 border-black shadow-[4px_4px_0_0_#0A0A0A] hover:shadow-[6px_6px_0_0_#0A0A0A] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer">
      <CardHeader className="border-b-2 border-black p-6">
        <CardTitle className="text-xl font-bold">Hoverable Card</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <p className="text-base text-gray-600">
          Hover over this card to see the effect
        </p>
      </CardContent>
    </Card>
  ),
  parameters: {
    pseudo: { hover: true },
  },
};

// Number Card (for features section)
export const NumberCard: Story = {
  render: () => (
    <Card className="w-80 border-2 border-black hover:bg-gray-50 transition-colors">
      <CardContent className="p-8">
        <div className="w-12 h-12 border-2 border-black flex items-center justify-center mb-4 shadow-[2px_2px_0_0_#0A0A0A]">
          <span className="text-2xl font-bold">01</span>
        </div>
        <CardTitle className="text-xl font-bold mb-2">Design</CardTitle>
        <CardDescription className="text-base">
          Crafting visual experiences that communicate and captivate.
        </CardDescription>
      </CardContent>
    </Card>
  ),
};

// Grid of Cards
export const CardGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y-2 md:divide-y-0 md:divide-x-2 divide-black border-2 border-black max-w-4xl">
      <Card className="p-8 hover:bg-gray-50 transition-colors">
        <CardContent>
          <div className="w-12 h-12 border-2 border-black flex items-center justify-center mb-4 shadow-[2px_2px_0_0_#0A0A0A]">
            <span className="text-2xl font-bold">01</span>
          </div>
          <CardTitle className="text-xl font-bold mb-2">Design</CardTitle>
          <CardDescription className="text-base">
            Crafting visual experiences that communicate and captivate.
          </CardDescription>
        </CardContent>
      </Card>

      <Card className="p-8 hover:bg-gray-50 transition-colors">
        <CardContent>
          <div className="w-12 h-12 border-2 border-black flex items-center justify-center mb-4 shadow-[2px_2px_0_0_#0A0A0A]">
            <span className="text-2xl font-bold">02</span>
          </div>
          <CardTitle className="text-xl font-bold mb-2">Develop</CardTitle>
          <CardDescription className="text-base">
            Building robust applications with modern technologies.
          </CardDescription>
        </CardContent>
      </Card>

      <Card className="p-8 hover:bg-gray-50 transition-colors">
        <CardContent>
          <div className="w-12 h-12 border-2 border-black flex items-center justify-center mb-4 shadow-[2px_2px_0_0_#0A0A0A]">
            <span className="text-2xl font-bold">03</span>
          </div>
          <CardTitle className="text-xl font-bold mb-2">Deliver</CardTitle>
          <CardDescription className="text-base">
            Shipping polished products that exceed expectations.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  ),
};

// Minimal Card (no borders)
export const Minimal: Story = {
  render: () => (
    <Card className="w-80 bg-gray-50">
      <CardContent className="p-6">
        <CardTitle className="text-lg font-bold mb-2">Minimal Card</CardTitle>
        <CardDescription className="text-sm">
          A simple card without heavy borders
        </CardDescription>
      </CardContent>
    </Card>
  ),
};
