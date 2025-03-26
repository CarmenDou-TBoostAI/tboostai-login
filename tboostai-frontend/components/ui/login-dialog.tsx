import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

interface LoginDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
    const router = useRouter()

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[350px] min-h-[380px] gap-8 py-8">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">Welcome back</DialogTitle>
                </DialogHeader>
                
                <p className="text-center text-muted-foreground text-sm px-6">
                    Log in or sign up to get smarter responses, upload files and images, and more.
                </p>
                
                <div className="flex flex-col gap-3 px-6 mt-auto">
                    <Button 
                        onClick={() => router.push('/login')}
                        className="w-full bg-black text-white hover:bg-black/90 h-11"
                    >
                        Log in
                    </Button>
                    <Button 
                        variant="outline" 
                        onClick={() => router.push('/signup')}
                        className="w-full border-[1px] border-black/10 hover:bg-gray-50 h-11"
                    >
                        Sign up
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className="w-full text-sm text-gray-500 hover:text-gray-900 hover:bg-transparent h-8"
                    >
                        Stay logged out
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}