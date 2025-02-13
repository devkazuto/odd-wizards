import { Footer } from "./layout/footer";

export function MobileComingSoon(){
    return (
        <div className="md:!hidden absolute top-0 left-0 right-0 bottom-0 z-[100] w-full h-full bg-[url('/images/About.gif')] bg-cover bg-center">
            <div className="relative w-full grid gap-y-6 mt-20">
                <img src="/images/mobile/logo.gif" className="w-[200px] mx-auto" />
                <img src="/images/mobile/goblin.png" className="absolute right-0 w-[200px] mx-auto" />
                <img src="/images/text-coming-soon.png" className="w-[200px] mx-auto mt-8" />
            </div>
            <Footer />
        </div>
    )
}