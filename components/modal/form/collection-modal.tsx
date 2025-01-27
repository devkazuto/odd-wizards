'use client';
import {
    Form,
    FormMessage,
    FormControl,
    FormLabel,
    FormItem,
    FormField
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog } from '@/components/ui/dialog';
import { DialogContent } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import ImageUpload from '@/components/ImageUpload';
import { ScrollArea } from '@/components/scroll-area';
import { Button } from '@/components/ui/button';

interface CollectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    loading: boolean;
}

export default function CollectionModal({
    isOpen,
    onClose,
    loading
}: CollectionModalProps) {

    const defaultValues = {
        startDate: new Date(),
        endDate: new Date()
    };

    const formSchema = z.object({
        priceUrl: z.string(),
        startDate: z.date(),
        endDate: z.date(),
        price: z.any().refine(value => value !== null && value !== undefined && value !== '' && !isNaN(value) && value > 0, {
            message: "Required",
        }),
        priceType: z.string(),
        isLeaderboard: z.string().optional(),
        maxTicket: z.any().refine(value => value !== null && value !== undefined && value !== '' && !isNaN(value) && value > 0, {
            message: "Required",
        }),
        winner: z.string().optional()
    });
    type FormValue = z.infer<typeof formSchema>;

    const form = useForm<FormValue>({
        resolver: zodResolver(formSchema),
        defaultValues
    });

    const onSubmit = () => {

    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[95%] md:!max-w-xl rounded-xl bg-black px-4">
                <h1 className="mr-4 font-londrina text-xl text-green-500 font-bold md:text-2xl xl:text-2xl">
                    Collection:
                </h1>
                <ScrollArea className='h-full max-h-[70vh]'>
                    <div className="flex w-full bg-black text-white">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="w-full space-y-4"
                            >
                                <div className="flex flex-col gap-x-8 px-4">
                                    <div className="my-2">
                                        <div className="col-span-2">
                                            <FormField
                                                control={form.control}
                                                name="priceUrl"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center">
                                                            <div className="h-1 w-1 rounded-full bg-white mr-2" /> Collection ID: <span className="text-green-500">*</span>
                                                        </FormLabel>
                                                        <div className="relative ml-auto flex-1 md:grow-0">
                                                            <FormControl>
                                                                <Input
                                                                    type="text"
                                                                    disabled={loading}
                                                                    placeholder="https://www.stargaze.zone/m/oddswizard/5263"
                                                                    className="w-full"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                        </div>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="my-2">
                                        <div className="col-span-2">
                                            <FormField
                                                control={form.control}
                                                name="priceUrl"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center">
                                                            <div className="h-1 w-1 rounded-full bg-white mr-2" /> Collection Address: <span className="text-green-500">*</span>
                                                        </FormLabel>
                                                        <div className="relative ml-auto flex-1 md:grow-0">
                                                            <FormControl>
                                                                <Input
                                                                    type="text"
                                                                    disabled={loading}
                                                                    placeholder="https://www.stargaze.zone/m/oddswizard/5263"
                                                                    className="w-full"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                        </div>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="my-2">
                                        <div className="col-span-2">
                                            <FormField
                                                control={form.control}
                                                name="priceUrl"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center">
                                                            <div className="h-1 w-1 rounded-full bg-white mr-2" /> Collection Name: <span className="text-green-500">*</span>
                                                        </FormLabel>
                                                        <div className="relative ml-auto flex-1 md:grow-0">
                                                            <FormControl>
                                                                <Input
                                                                    type="text"
                                                                    disabled={loading}
                                                                    placeholder="https://www.stargaze.zone/m/oddswizard/5263"
                                                                    className="w-full"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                        </div>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="my-2">
                                        <div className="col-span-2">
                                            <FormField
                                                control={form.control}
                                                name="priceUrl"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center">
                                                            <div className="h-1 w-1 rounded-full bg-white mr-2" /> Description: <span className="text-green-500">*</span>
                                                        </FormLabel>
                                                        <div className="relative ml-auto flex-1 md:grow-0">
                                                            <FormControl>
                                                                <Textarea
                                                                    rows={3}
                                                                    disabled={loading}
                                                                    placeholder="https://www.stargaze.zone/m/oddswizard/5263"
                                                                    className="w-full"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                        </div>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="my-2">
                                        <div className="col-span-2">
                                            <FormField
                                                control={form.control}
                                                name="priceUrl"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center">
                                                            <div className="h-1 w-1 rounded-full bg-white mr-2" /> Supply: <span className="text-green-500">*</span>
                                                        </FormLabel>
                                                        <div className="relative ml-auto flex-1 md:grow-0">
                                                            <FormControl>
                                                                <Input
                                                                    type="text"
                                                                    disabled={loading}
                                                                    placeholder="10000"
                                                                    className="w-full"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                        </div>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className='my-2'>
                                        <div className="col-span-2">
                                            <FormField
                                                control={form.control}
                                                name="priceUrl"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center">
                                                            <div className="h-1 w-1 rounded-full bg-white mr-2" /> Banner Url: <span className="text-green-500">*</span>
                                                        </FormLabel>
                                                        <div className="relative ml-auto flex-1 md:grow-0">
                                                            <FormControl>
                                                                <ImageUpload />
                                                            </FormControl>
                                                        </div>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </Form>
                    </div>
                </ScrollArea>
                <div className='flex justify-end'>
                    <Button className="bg-green-500 hover:bg-green-600 text-black rounded-[10px]">Save</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
