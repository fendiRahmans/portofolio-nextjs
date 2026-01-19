import { Label } from "../ui/Label";
import { Input } from "../ui/Input";
import { TextArea } from "../ui/TextArea";
import { Button } from "../ui/Button";

export default function ContactForm() {
  return (
    <section className="w-full md:w-7/12">
      <div className="glass-form p-8 lg:p-14 rounded-3xl h-full flex flex-col justify-center">
        <form action="#" className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                icon="person"
                placeholder="Enter your name"
                type="text"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                icon="mail"
                placeholder="email@example.com"
                type="email"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <TextArea
              id="message"
              name="message"
              icon="chat"
              placeholder="Describe your project vision..."
              rows={8}
            />
          </div>
          <Button type="submit" icon="arrow_forward">
            Send Message
          </Button>
        </form>
      </div>
    </section>
  );
}
