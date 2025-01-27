"use client"
import Header from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ChangeEvent, useEffect, useState } from "react";
import getConfig from "@/config/config";
import { useUser } from "@/hooks/useUser";
import axios, { AxiosError } from "axios";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import {
    Form,
    FormMessage,
    FormControl,
    FormLabel,
    FormItem,
    FormField
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DateTimePicker } from "@/components/ui/datetime-picker";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import moment from 'moment';
import { promiseToast } from "@/components/ui/use-toast";
import { useChain } from "@cosmos-kit/react";
import { cn, extractCollectionAndTokenId, formatDecimal, getToken } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import ImageUpload from "@/components/ImageUpload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { useDynamicTables } from "@/hooks/useDynamicTables";
import { columns } from "@/components/tables/collections-tables/columns";
import { useRouter } from "next/navigation";
import { MstCollection } from "@/types/collection";
import { DataTable } from "@/components/tables/dynamic-tables";
import CollectionModal from "@/components/modal/form/collection-modal";

type paramsProps = {
    searchParams: {
        [key: string]: string | string[] | undefined;
    };
};

export default function Stake({ searchParams }: paramsProps) {
    const config = getConfig();
    const [loading, setLoading] = useState<boolean>(false);
    const { address } = useChain("stargaze");
    const [collectionModal, setCollectionModal] = useState<boolean>(false);

    const {
        page,
        setPage,
        pageLimit,
        setPageLimit,
        search,
        setSearch,
        sorting,
        setSorting,
        pageCount,
        setPageCount,
        ttlRecords,
        setTtlRecords,
        data,
        setData,
        addFilters,
        params,
        addSorting
    } = useDynamicTables<MstCollection>(searchParams);
    const router = useRouter();
    const columnDefs = columns(router, page, pageLimit);

    useEffect(() => {
        if (config && address && !config.owners.includes(address)) {
            window.location.href = '/raffle';
        }
    }, [address]);

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

    const onSubmit = (data: FormValue) => {
        setLoading(true);
        promiseToast(createProject(data), {
            loading: {
                title: "Processing...",
                description: "Please Wait"
            },
            success: () => {
                window.location.reload();
                setLoading(false);
                return {
                    title: "Success!",
                    description: "Create Raffle Success"
                };
            },
            error: (error: AxiosError | any) => ({
                title: "Ups! Something wrong.",
                description: error?.response?.data?.message || 'Internal server error.'
            })
        });
    };

    const createProject = async (data: FormValue) => {
        const { collection, tokenId } = extractCollectionAndTokenId(form.watch("priceUrl"));
        await axios.post("/api/raffle/create", {
            price: data.price,
            wallet_address: address,
            start_date: data.startDate,
            end_date: data.endDate,
            max_ticket: data.maxTicket,
            type: data.priceType,
            win_address: data.winner,
            collection_address: collection,
            token_id: tokenId
        });
    }

    return (
        <div className="relative bg-black w-full">
            <Header />
            <CollectionModal isOpen={collectionModal} onClose={() => setCollectionModal(false)} loading={false} />
            <div>
                <div className="grid">
                    <div className="px-10 mt-16 px-4 md:!px-10 md:!mt-24 mx-auto py-4 md:!py-6 gap-x-32 text-left flex flex-col items-center">
                        {
                            !address ? (
                                <div className="w-full h-[350px] flex justify-center items-center">
                                    <h1 className="text-4xl font-bold">Please Login</h1>
                                </div>
                            ) : (
                                <div>
                                    <div>
                                        <div className="flex justify-center">
                                            <h1 className="font-display text-[36px] md:!text-4xl font-black">
                                                Create Project
                                            </h1>
                                        </div>
                                    </div>
                                    {/* <div className="grid grid-cols-1 gap-10"> */}
                                    <Form {...form}>
                                        <form
                                            onSubmit={form.handleSubmit(onSubmit)}
                                            className="w-full space-y-4"
                                        >
                                            <div className="flex gap-x-8">
                                                <div className="grid">
                                                    <div className="my-4">
                                                        <h1 className="mr-4 font-londrina text-xl text-green-500 font-bold md:text-2xl xl:text-2xl">
                                                            Project Details:
                                                        </h1>
                                                        <div className="my-2 grid grid-cols-2">
                                                            <div className="col-span-2">
                                                                <FormField
                                                                    control={form.control}
                                                                    name="priceUrl"
                                                                    render={({ field }) => (
                                                                        <FormItem>
                                                                            <FormLabel className="flex items-center">
                                                                                <div className="h-1 w-1 rounded-full bg-white mr-2" /> Project Name: <span className="text-green-500">*</span>
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
                                                        <div className="my-2 grid grid-cols-2">
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
                                                        <div className="my-4">
                                                            <div className="my-2 grid grid-cols-2 gap-y-4">
                                                                <div className="mr-4">
                                                                    <FormField
                                                                        control={form.control}
                                                                        name="isLeaderboard"
                                                                        render={({ field }) => (
                                                                            <FormItem>
                                                                                <FormLabel className="flex items-center">
                                                                                    <div className="h-1 w-1 rounded-full bg-white mr-2" /> Is Leaderboard: <span className="text-green-500">*</span>
                                                                                </FormLabel>
                                                                                <div className="relative ml-auto flex-1 md:grow-0">
                                                                                    <FormControl>
                                                                                        <Checkbox />
                                                                                    </FormControl>
                                                                                </div>
                                                                                <FormMessage />
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </div>
                                                                <div className="ml-4">
                                                                    <FormField
                                                                        control={form.control}
                                                                        name="price"
                                                                        render={({ field }) => (
                                                                            <FormItem>
                                                                                <FormLabel className="flex items-center">
                                                                                    <div className="h-1 w-1 rounded-full bg-white mr-2" /> Status : <span className="text-green-500">*</span>
                                                                                </FormLabel>
                                                                                <div className="relative ml-auto flex-1 md:grow-0">
                                                                                    <FormControl>
                                                                                        <Select onValueChange={field.onChange}
                                                                                            value={field.value?.toString()}
                                                                                            defaultValue={field.value?.toString()}
                                                                                            disabled={loading}>
                                                                                            <SelectTrigger className="w-full">
                                                                                                <SelectValue defaultValue={field.value?.toString()} placeholder="--Select--" />
                                                                                            </SelectTrigger>
                                                                                            <SelectContent>
                                                                                                <SelectGroup>
                                                                                                    <SelectLabel>Choose Status</SelectLabel>
                                                                                                    <SelectItem value="N">DRAFT</SelectItem>
                                                                                                    <SelectItem value="P">PUBLISH</SelectItem>
                                                                                                    <SelectItem value="C">CANCELED</SelectItem>
                                                                                                </SelectGroup>
                                                                                            </SelectContent>
                                                                                        </Select>
                                                                                    </FormControl>
                                                                                </div>
                                                                                <FormMessage />
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </div>
                                                                <div className="mr-4">
                                                                    <FormField
                                                                        control={form.control}
                                                                        name="endDate"
                                                                        render={({ field }) => (
                                                                            <FormItem>
                                                                                <FormLabel className="flex items-center">
                                                                                    <div className="h-1 w-1 rounded-full bg-white mr-2" />Discord Color<span className="text-green-500">*</span>
                                                                                </FormLabel>
                                                                                <div className="relative ml-auto flex-1 md:grow-0">
                                                                                    <FormControl>
                                                                                        <DateTimePicker
                                                                                            className="w-full"
                                                                                            placeholder="MMMM DD, YYYY h:mm A ..."
                                                                                            value={moment(field.value).format("YYYY-MM-DD HH:mm:ss")}
                                                                                            onChangeDateTime={(value) => {
                                                                                                const date = new Date(moment(value, "YYYY-MM-DD h:mm A").format());
                                                                                                field.onChange(date);
                                                                                                field.value = date;
                                                                                            }}
                                                                                        />
                                                                                    </FormControl>
                                                                                </div>
                                                                                <FormMessage />
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </div>
                                                                <div className="ml-4">
                                                                    <FormField
                                                                        control={form.control}
                                                                        name="maxTicket"
                                                                        render={({ field }) => (
                                                                            <FormItem>
                                                                                <FormLabel className="flex items-center">
                                                                                    <div className="h-1 w-1 rounded-full bg-white mr-2" />Twiter Color: <span className="text-green-500">*</span>
                                                                                </FormLabel>
                                                                                <div className="relative ml-auto flex-1 md:grow-0">
                                                                                    <FormControl>
                                                                                        <Input
                                                                                            min={1}
                                                                                            type="number"
                                                                                            disabled={loading}
                                                                                            placeholder="2500 ..."
                                                                                            {...field}
                                                                                        />
                                                                                    </FormControl>
                                                                                </div>
                                                                                <FormMessage />
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </div>
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
                                                                <div className="mr-4">
                                                                    <FormField
                                                                        control={form.control}
                                                                        name="endDate"
                                                                        render={({ field }) => (
                                                                            <FormItem>
                                                                                <FormLabel className="flex items-center">
                                                                                    <div className="h-1 w-1 rounded-full bg-white mr-2" /> Footer Discord <span className="text-green-500">*</span>
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
                                                                <div className="ml-4">
                                                                    <FormField
                                                                        control={form.control}
                                                                        name="maxTicket"
                                                                        render={({ field }) => (
                                                                            <FormItem>
                                                                                <FormLabel className="flex items-center">
                                                                                    <div className="h-1 w-1 rounded-full bg-white mr-2" /> Footer Twiter : <span className="text-green-500">*</span>
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
                                                        <Tabs defaultValue="collection" className="w-full">
                                                            <TabsList className="flex">
                                                                <TabsTrigger className="w-full" value="collection">Collection</TabsTrigger>
                                                                {
                                                                    form.watch("isLeaderboard") == "Y" && <TabsTrigger className="w-full" value="rewards">Rewards</TabsTrigger>
                                                                }
                                                            </TabsList>
                                                            <TabsContent value="collection">
                                                                <Button type="button" onClick={() => setCollectionModal(true)} className="bg-green-500 hover:bg-green-600 text-black rounded-[10px]"><Plus className="mr-1" />Add Collection</Button>
                                                                <div>
                                                                    <DataTable sortingValue={sorting} searchValue={search} columns={columnDefs} data={data} pageCount={pageCount} />
                                                                </div>
                                                            </TabsContent>
                                                            <TabsContent value="rewards">Change your password here.</TabsContent>
                                                        </Tabs>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                disabled={loading}
                                                variant={'ghost'}
                                                className="h-12 bg-green-500 w-full rounded-full text-2xl font-bold text-black hover:bg-green-500 hover:text-black"
                                            >
                                                Create Project
                                            </Button>
                                        </form>
                                    </Form>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div >
            <div className="h-full py-12 md:py-16">
                <Footer className="my-0" />
            </div>
        </div >
    );
}