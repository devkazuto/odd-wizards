"use client";
import StakeSection from "@/components/home/StakeSection";
import Header from "@/components/layout/header";
import Carousel from "@/components/Carausel";
import Leaderboard from "@/components/Leaderboard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Footer } from "@/components/layout/footer";
import GradualSpacing from "@/components/ui/gradual-spacing";
import CustomGradualSpacing from "@/components/CustomGradouselSpacing";
import Snowfall from 'react-snowfall';

const imageList = [
  { src: "https://i.stargaze-apis.com/pZa0xBOtYOrxbFADavj6t8T8MVRUkeSDo9OvfpvDRXc/f:jpg/resize:fit:700:::/dpr:2/plain/ipfs://bafybeifpduio7sv3cy3ok76j3ldvrwan6owqv5uvrkk5xhuiuvhuy5eupe/558.jpg", alt: "German Shepherd #558", name: "Expedition" },
  { src: "https://i.stargaze-apis.com/dIbflJ7mIjUVCe3t0p-XzDsaaROmvetFM_20Q6DNUmc/f:jpg/resize:fit:700:::/dpr:2/plain/ipfs://bafybeibhs2db2hthmlnwfvbuduvorybvazltxdmir5w4zoidhzfrbmyvom/885.png", alt: "Drama Queens #885", name: "Drama Queens" },
  { src: "https://i.stargaze-apis.com/QXMxL1PKl2iQGXz_PdwoF91nxE4QxQm3_gW24MyYdd4/f:jpg/resize:fit:700:::/dpr:2/plain/ipfs://bafybeigw4vpt3hgdqljtcwglxxb3cwojt24rxnx77cii5wueubsi73temq/32.png", alt: "Pixel Plebs #32", name: "Pixel Plebs" },
  { src: "https://i.stargaze-apis.com/wyBIIMz8ff3TKbVMpCXHpW2Q8yeY-_WHHN_J-UAIiEM/f:jpg/resize:fit:700:::/dpr:2/plain/ipfs://bafybeibfsrsgkid53ilogyziykbhkj46h5usts22fw3zuxk3esw7sns5xa/3218.png", alt: "Scientist#3218", name: "Nucleus" },
  { src: "https://i.stargaze-apis.com/i3462axock4w0yZqFyU1KFs1wqI5BPWaJd9staBClHI/f:jpg/resize:fit:700:::/dpr:2/plain/ipfs://bafybeigkl7dwo6n7lgvq6g6kh2n37mojxxsebgshiguztm7buce2zisg6q/6765.png", alt: "The Watchers #6765", name: "The Watchers" },
  { src: "https://i.stargaze-apis.com/E-cAIUJgC0hFtXiFpf73CFLi5mKWApUWblo0eeaaas0/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeibw2dqcn6rxy7cmycjyangh42ruhc5gishlffivx3fsbtbtlyhrjq/99.png", alt: "FFSC Frankie", name: "FFSC Frankie" },
  { src: "https://i.stargaze-apis.com/BY_-NMf9_5nnfVKXLuUzaVr5SznKC1Yslwk2dSH1lWk/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeihdqphkd5t3max6flguoclbanvuxmt5krae5ga3u7zwxajzrlfocq/1932.png", alt: "Digitz #1932", name: "Digitz" },
  { src: "https://i.stargaze-apis.com/EbmwYUojWPPyaBklwBn2xWZrcgtT2y5qysWQ-LFz5aE/f:jpg/resize:fit:700:::/dpr:2/plain/ipfs://bafybeifjyejf6s4lnnqyapkyziyadubsa4topvh3dyicn374b4vukzpiam/7949.jpg", alt: "Stamp #1215", name: "Stamps" },
  { src: "https://i.stargaze-apis.com/aRID07xNUwrVpu6-neWOk8oFPcMEy0VteVJR2afEiLw/f:jpg/resize:fit:700:::/dpr:2/plain/ipfs://bafybeidfqzk3dw35shideegsoa6pbkrnfl2gljmvlqpxo73of77ohjyqwq/35.png", alt: "Rebbits #35", name: "Rebbits" },
  { src: "https://i.stargaze-apis.com/AEXkz10rYjBog11DNW3wL3KyPSTUlmlRga_NgtsuK3E/f:jpg/resize:fit:700:::/dpr:2/plain/ipfs://bafybeidfqzk3dw35shideegsoa6pbkrnfl2gljmvlqpxo73of77ohjyqwq/657.png", alt: "Rebbits #657", name: "Rebbits" },
  { src: "https://i.stargaze-apis.com/447rBZJ_KvWddvqaLSd8O1ZoqS_CuJmPbQvJD427hQk/f:jpg/resize:fit:700:::/dpr:2/plain/ipfs://bafybeidgd7uu236aicaqd7bydry2xp4zbjdmqhfmb6tftk6plvykg5tgmq/1435.png", alt: "Hitobito #1435", name: "Hitobito" },
  { src: "https://i.stargaze-apis.com/DQiMyw-oIiRqc7W_ehnEJ-lIUJfskuvGPKa8XdzdfcA/f:jpg/resize:fit:700:::/dpr:2/plain/ipfs://bafybeid7jma4j7lhmnwen53x76vnixcv6d3cklaavxoyb2cu2bnlwwh5ni/288.png", alt: "RarityBotz #288", name: "RarityBotz" },
  { src: "https://www.oddsgarden.io/images/kitty-790.png", alt: "Yield Kitty #790", name: "Yield Kitty" },
  { src: "https://i.stargaze-apis.com/Ktru9k2G_8A60wNPSjbdrLtMOzL5VAc9vgVKDRHsAbk/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://QmajL3RBHujxeTu4MoJs8ZQuH7gmwWBVfCxjVnV5u3CR5i/8634.jpeg", alt: "Reaper #8634", name: "Underworld Necropolis" },
  { src: "https://i.stargaze-apis.com/Wo1hmNFgB8speFhQKeZwEiJQlnADUVDpcJ25zmgIPk0/f:jpg/resize:fit:700:::/dpr:2/plain/ipfs://Qmc2e9A7GM5AsqxhK6ny9TLVEnKMJeFyZWETYZNeU4awBE/openart-269b0d069edb438185e076a464cfb3ec_raw.jpg", alt: "Smokey Samantha", name: "Things" },
  { src: "https://i.stargaze-apis.com/gc2RJCII4OxW2eu7W8OulJKJslninJnVrE0LPWK5zjw/f:jpg/resize:fit:700:::/dpr:2/plain/ipfs://bafybeihl5m3fuioq347gcry7v6zfvriioqwjjl5q7y74cecj6zvsmn65ci/4424.png", alt: "Elysian Horde #4424", name: "Elysian Horde" },
  { src: "https://i.stargaze-apis.com/tcQv_XHOQ51n22qWForHitzoRIf4KV5S6A8PDOlKbMk/f:jpg/resize:fit:700:::/dpr:2/plain/ipfs://bafybeiee72m4iurkpon5fflg3w5twce6pkqywmvsdedrgq6nqvmnm534o4/574.png", alt: "Baaaad Kid #574", name: "Baaaad Kids" },
  { src: "https://i.stargaze-apis.com/TNOoS03TvDUFlkDSZ67tDpC0RxzTLclf8hL5qyiAygg/f:jpg/resize:fit:700:::/dpr:2/plain/ipfs://bafybeidbxpppa6catqaf2zatk6nh3b3ca7mune6jluima7mxaj4uijt6fq/9853.png", alt: "Baaaad Kid #9853", name: "Baaaad Kids" },
  { src: "https://i.stargaze-apis.com/GFsVdB1KeS6wMWFNIDgMAwvUgZgIBnODd4kSymXrv7k/f:jpg/resize:fit:700:::/dpr:2/plain/ipfs://bafybeiaa3eueevoug6vkvyhyrjbwonzfpifmea2wui7xfgac7fevgresha/12.png", alt: "Steamland #12", name: "Steamland" },
  { src: "https://i.stargaze-apis.com/BqMnIAUuMoCfOv1aRroCXi9u9Iapqgrna31lAykdsuo/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeiaa3eueevoug6vkvyhyrjbwonzfpifmea2wui7xfgac7fevgresha/1020.png", alt: "Steamland #1020", name: "Steamland" },
  { src: "https://i.stargaze-apis.com/ccfMgLIhLzQfSka9Xh-l_V-stfd8P9dHAALkY_EfkmY/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeiaa3eueevoug6vkvyhyrjbwonzfpifmea2wui7xfgac7fevgresha/490.png", alt: "Steamland #490", name: "Steamland" },
  { src: "https://i.stargaze-apis.com/Khj-2Pcva6gPLJzvCTgljOjZr1G_tNEsRx2LGuksHbs/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeiaa3eueevoug6vkvyhyrjbwonzfpifmea2wui7xfgac7fevgresha/376.png", alt: "Steamland #376", name: "Steamland" },
  { src: "https://i.stargaze-apis.com/iwHhj2jKB-7NcINfOtymSghgI6F_oDWp-Smn95WG2Uk/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeiaa3eueevoug6vkvyhyrjbwonzfpifmea2wui7xfgac7fevgresha/2357.png", alt: "Steamland #2357", name: "Steamland" },
  { src: "https://i.stargaze-apis.com/j8XgqTX7hYzleQSYvG6dj-fYXAXs6WwVVeGDIrAsh_8/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeiaa3eueevoug6vkvyhyrjbwonzfpifmea2wui7xfgac7fevgresha/259.png", alt: "Steamland #259", name: "Steamland" },
  { src: "https://i.stargaze-apis.com/s5sqAxkWuL-DmgSVZfvKc5xIAqnhQaLRjdBh6VhXTfs/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeiaa3eueevoug6vkvyhyrjbwonzfpifmea2wui7xfgac7fevgresha/2802.png", alt: "Steamland #2802", name: "Steamland" },
  { src: "https://i.stargaze-apis.com/d4DSCNssJXMXlxTkrAt8bkWgmK80mfN-7IiI12GfMvc/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeiaa3eueevoug6vkvyhyrjbwonzfpifmea2wui7xfgac7fevgresha/1078.png", alt: "Steamland #1078", name: "Steamland" },
  { src: "https://i.stargaze-apis.com/VfcgPNUml34E9vG9KIZFeLrd3bHkE3aT0WIf4uT8m-Y/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeiaa3eueevoug6vkvyhyrjbwonzfpifmea2wui7xfgac7fevgresha/1970.png", alt: "Steamland #1970", name: "Steamland" },
  { src: "https://i.stargaze-apis.com/rGZON97bxDqUJm0dnsBQQaKZXLDpqU8zmRu0Ju1t-G0/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeiaa3eueevoug6vkvyhyrjbwonzfpifmea2wui7xfgac7fevgresha/1621.png", alt: "Steamland #1621", name: "Steamland" },
  { src: "https://i.stargaze-apis.com/5gQ1z-_-zBw97jUc9aqrgHg7z6dttEjMYiw87bb4npM/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeiaa3eueevoug6vkvyhyrjbwonzfpifmea2wui7xfgac7fevgresha/1521.png", alt: "Steamland #1521", name: "Steamland" },
  { src: "https://i.stargaze-apis.com/lCRV-dLfIGbH3OVA1IurN0NpVJEEIxP5idKtr_ixgaM/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeiaa3eueevoug6vkvyhyrjbwonzfpifmea2wui7xfgac7fevgresha/1461.png", alt: "Steamland #1461", name: "Steamland" },
  { src: "https://i.stargaze-apis.com/tGmsIo9hHwCFYkNnpipII2OKbua7E_KgRbwUPI4dwOI/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeifn3ewx25vwggecnexeh43rwgkugzkxn6rxt74z4dbpimfqzsuijy/155.png", alt: "Ink Cat Biz (ICB) #155", name: "Ink Cat Biz" },
  { src: "https://i.stargaze-apis.com/vHKoC79OSxBTgJxf2LChcBpXwkpWR8FaM-gJbtGgdqc/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeifn3ewx25vwggecnexeh43rwgkugzkxn6rxt74z4dbpimfqzsuijy/229.png", alt: "Ink Cat Biz (ICB) #229", name: "Ink Cat Biz" },
  { src: "https://i.stargaze-apis.com/fbpbd9tmsxGu8O7aE88MMUjixCMLHXSpDDq3lkYSoTc/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeifn3ewx25vwggecnexeh43rwgkugzkxn6rxt74z4dbpimfqzsuijy/722.png", alt: "Ink Cat Biz (ICB) #722", name: "Ink Cat Biz" },
  { src: "https://i.stargaze-apis.com/KmHjEis3X6IsJFjDrcekEMFtjeXKjKWIvTaliiQUQaE/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeifn3ewx25vwggecnexeh43rwgkugzkxn6rxt74z4dbpimfqzsuijy/158.png", alt: "Ink Cat Biz (ICB) #158", name: "Ink Cat Biz" },
  { src: "https://i.stargaze-apis.com/CrWsY3qeROIxKKiYMc5ZbMIPtoyyyTo92i5dqml9e1Q/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeifn3ewx25vwggecnexeh43rwgkugzkxn6rxt74z4dbpimfqzsuijy/994.png", alt: "Ink Cat Biz (ICB) #994", name: "Ink Cat Biz" },
  { src: "https://i.stargaze-apis.com/69q-bz-5StHhQpntWOOjrkRNa6tiAu0xgdd-cYDAKrc/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeifn3ewx25vwggecnexeh43rwgkugzkxn6rxt74z4dbpimfqzsuijy/645.png", alt: "Ink Cat Biz (ICB) #645", name: "Ink Cat Biz" },
  { src: "https://i.stargaze-apis.com/RSuchAFQ52I4TOLCfjjY9V_HoIE55xTgi8yMKFJopYQ/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeifn3ewx25vwggecnexeh43rwgkugzkxn6rxt74z4dbpimfqzsuijy/1102.png", alt: "Ink Cat Biz (ICB) #1102", name: "Ink Cat Biz" },
  { src: "https://i.stargaze-apis.com/JtCv-XomIxXLps2tzzqr5Gq8tvqYoYHa8GyuX4n5D_4/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeifn3ewx25vwggecnexeh43rwgkugzkxn6rxt74z4dbpimfqzsuijy/918.png", alt: "Ink Cat Biz (ICB) #918", name: "Ink Cat Biz" },
  { src: "https://i.stargaze-apis.com/JNBNQoEjZasigNYXcigURONoF7fvXTHav77H_9tzOdw/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeifn3ewx25vwggecnexeh43rwgkugzkxn6rxt74z4dbpimfqzsuijy/684.png", alt: "Ink Cat Biz (ICB) #684", name: "Ink Cat Biz" },
  { src: "https://i.stargaze-apis.com/IucdzyZMLuWo41aDiFXXqXQubzdDuwFvlwPejapuBr0/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeifn3ewx25vwggecnexeh43rwgkugzkxn6rxt74z4dbpimfqzsuijy/902.png", alt: "Ink Cat Biz (ICB) #902", name: "Ink Cat Biz" },
  { src: "https://i.stargaze-apis.com/vg2zTqGjQ00-Bc3g6f_fj6FRqYEdxOfeOeRW8G_czrw/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeigwhpdmupm754ceuxgakgksfpzmq2kdz4y5imb7k46stiwamtt6fi/327.png", alt: "Maxi #327", name: "Pink Is Punk" },
  { src: "https://i.stargaze-apis.com/dYA-dmMX0IdULr_jB1FcktcxykjicKxILWUaKpVqWvg/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeigwhpdmupm754ceuxgakgksfpzmq2kdz4y5imb7k46stiwamtt6fi/503.png", alt: "Wannabe #503", name: "Pink Is Punk" },
  { src: "https://i.stargaze-apis.com/Kl3i-dfrXsfpyqtRvXdBWTaEdvNrqOav68_fK6gYQ4k/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeigwhpdmupm754ceuxgakgksfpzmq2kdz4y5imb7k46stiwamtt6fi/900.png", alt: "Dirty #900", name: "Pink Is Punk" },
  { src: "https://i.stargaze-apis.com/fRS4yxszSlZjAWazJrx5gBDs8ph53_MPpMyudXxH5ns/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeigwhpdmupm754ceuxgakgksfpzmq2kdz4y5imb7k46stiwamtt6fi/508.png", alt: "Wannabe #508", name: "Pink Is Punk" },
  { src: "https://i.stargaze-apis.com/OPGkwqZ9fqK4c3NPF3bjxgJNO2nhGN_P3PMW75JrgFA/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeigwhpdmupm754ceuxgakgksfpzmq2kdz4y5imb7k46stiwamtt6fi/278.png", alt: "Maxi #278", name: "Pink Is Punk" },
  { src: "https://i.stargaze-apis.com/HdP4bSNY0tDLeWyGmJvtItd9_tT9OoduKPx4vpgUq8E/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeigwhpdmupm754ceuxgakgksfpzmq2kdz4y5imb7k46stiwamtt6fi/294.png", alt: "Maxi #294", name: "Pink Is Punk" },
  { src: "https://i.stargaze-apis.com/onVfMGn1RtatOJBI6rGhuchgWhpXRuqZG5-0qc1yrF8/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeigwhpdmupm754ceuxgakgksfpzmq2kdz4y5imb7k46stiwamtt6fi/419.png", alt: "Wannabe #419", name: "Pink Is Punk" },
  { src: "https://i.stargaze-apis.com/3GgM4pbwFvRt5KgqtAoiucu2FMUnV7ug3APxUqq5wXI/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeigwhpdmupm754ceuxgakgksfpzmq2kdz4y5imb7k46stiwamtt6fi/884.png", alt: "Dirty #884", name: "Pink Is Punk" },
  { src: "https://i.stargaze-apis.com/wYsm-NA5sVh_5vQpui8NV-tvdcXyQ72cF4tZbVe4tD8/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeigwhpdmupm754ceuxgakgksfpzmq2kdz4y5imb7k46stiwamtt6fi/191.png", alt: "Maxi #191", name: "Pink Is Punk" },
  { src: "https://i.stargaze-apis.com/Gv4N62OlZcHzEeM5JvkDmOblHg0MiBoSRboek5xMkrs/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeiepqoejchgbzveolzksjx27ket3zdzcxu4uxt42aa3ncwl7sovfka/778.png", alt: "PET #778", name: "My Pet Alien" },
  { src: "https://i.stargaze-apis.com/q1gvo02zdOyPKZXKg_Imfc2jE-e0TG2AOVPWr4CZRIo/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeiepqoejchgbzveolzksjx27ket3zdzcxu4uxt42aa3ncwl7sovfka/1049.png", alt: "PET #1049", name: "My Pet Alien" },
  { src: "https://i.stargaze-apis.com/WEQ3rA5GHh4YfmkcIXSBPPDbdLEU_f5ZqbOH1jwyugU/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeiepqoejchgbzveolzksjx27ket3zdzcxu4uxt42aa3ncwl7sovfka/1165.png", alt: "PET #1165", name: "My Pet Alien" },
  { src: "https://i.stargaze-apis.com/ErEvEmjmgjELXrBshBs8pAVDFjk0BHK3_6LgqQv7S60/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeiepqoejchgbzveolzksjx27ket3zdzcxu4uxt42aa3ncwl7sovfka/1556.png", alt: "PET #1556", name: "My Pet Alien" },
  { src: "https://i.stargaze-apis.com/pRtKWfzq3yCiXqmHYzxEDDRg4v5yWf5POTxjyAAha68/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeiepqoejchgbzveolzksjx27ket3zdzcxu4uxt42aa3ncwl7sovfka/1918.png", alt: "PET #1918", name: "My Pet Alien" },
  { src: "https://i.stargaze-apis.com/A2RG6TcwGVGldkTDFCLj71L8mV4axFvGWOzaOBuojYI/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeiepqoejchgbzveolzksjx27ket3zdzcxu4uxt42aa3ncwl7sovfka/761.png", alt: "PET #761", name: "My Pet Alien" },
  { src: "https://i.stargaze-apis.com/FW9NvTfeHS0Gei2klYJZVowswLN4vojFZZoPplNa9ns/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeiepqoejchgbzveolzksjx27ket3zdzcxu4uxt42aa3ncwl7sovfka/968.png", alt: "PET #968", name: "My Pet Alien" },
  { src: "https://i.stargaze-apis.com/rZZNQbCi-ny8SStfvZ22U6NFmtHsc69iXfoyi9i8KQI/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeiepqoejchgbzveolzksjx27ket3zdzcxu4uxt42aa3ncwl7sovfka/1393.png", alt: "PET #1393", name: "My Pet Alien" },
  { src: "https://i.stargaze-apis.com/afxoX-d2JCmScQUdZtzgaQMzf8CNas04ZlwtoAC-xGg/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeiepqoejchgbzveolzksjx27ket3zdzcxu4uxt42aa3ncwl7sovfka/1223.png", alt: "PET #1223", name: "My Pet Alien" },
  { src: "https://i.stargaze-apis.com/iIlT4v7hAMHpIQ49MOVbds7dNw1EsOscQpWbGfQPJ4c/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeiepqoejchgbzveolzksjx27ket3zdzcxu4uxt42aa3ncwl7sovfka/1314.png", alt: "PET #1314", name: "My Pet Alien" },
  { src: "https://i.stargaze-apis.com/beHK9JmYt5uxoWKwce42NkM9j7eDkTG8uJzvxhSQZ6w/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeiepqoejchgbzveolzksjx27ket3zdzcxu4uxt42aa3ncwl7sovfka/1050.png", alt: "PET #1050", name: "My Pet Alien" },
  { src: "https://i.stargaze-apis.com/fx2F86aa9wtQADrboFl1NIEsuA-7nsAGKmk9tmgJdlg/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeids5d5zyyerac3qvmy7mrhojsoumsgepnk55qkm5v3eetxu2ajhlm/3921.png", alt: "Hooded Syndicate #3921", name: "Hooded Syndicate" },
  { src: "https://i.stargaze-apis.com/QmbKufNkay_Hh_CXyVaPUsOq_sbeI1TSWKc0CRs9wKA/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeids5d5zyyerac3qvmy7mrhojsoumsgepnk55qkm5v3eetxu2ajhlm/1996.png", alt: "Hooded Syndicate #1996", name: "Hooded Syndicate" },
  { src: "https://i.stargaze-apis.com/tZKVlIwO4yKWWO_svclv_QnJKp2b-siWuHatmmQ3nsA/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeids5d5zyyerac3qvmy7mrhojsoumsgepnk55qkm5v3eetxu2ajhlm/896.png", alt: "Hooded Syndicate #896", name: "Hooded Syndicate" },
  { src: "https://i.stargaze-apis.com/8iCh3ZPV8rGnSlew59xkQFrgKYx-S9GkCGusl6S0iNk/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeids5d5zyyerac3qvmy7mrhojsoumsgepnk55qkm5v3eetxu2ajhlm/1625.png", alt: "Hooded Syndicate #1625", name: "Hooded Syndicate" },
  { src: "https://i.stargaze-apis.com/IXlP5eHqhz7O81mWHxJmlsDtGvrgo_f6HUP8XB63iww/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeids5d5zyyerac3qvmy7mrhojsoumsgepnk55qkm5v3eetxu2ajhlm/4832.png", alt: "Hooded Syndicate #4832", name: "Hooded Syndicate" },
  { src: "https://i.stargaze-apis.com/dYAPqypilmE3jMg9iZEvn6LaYrECEBQchG9qY69nJrM/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeids5d5zyyerac3qvmy7mrhojsoumsgepnk55qkm5v3eetxu2ajhlm/349.png", alt: "Hooded Syndicate #349", name: "Hooded Syndicate" },
  { src: "https://i.stargaze-apis.com/Y757e-q2zboZpIQ2XTnW-vN1Mzllb43e0EpxW_wtyeM/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeids5d5zyyerac3qvmy7mrhojsoumsgepnk55qkm5v3eetxu2ajhlm/4899.png", alt: "Hooded Syndicate #4899", name: "Hooded Syndicate" },
  { src: "https://i.stargaze-apis.com/eg126kwgWpnFVXM5fIIGkgDzJPsqHGW75EOBMcO8gAQ/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeids5d5zyyerac3qvmy7mrhojsoumsgepnk55qkm5v3eetxu2ajhlm/3646.png", alt: "Hooded Syndicate #3646", name: "Hooded Syndicate" },
  { src: "https://i.stargaze-apis.com/sY5mDK72OpSILEe6HjtlOd0z-_gLh6PD9QRt5MEkfr8/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeids5d5zyyerac3qvmy7mrhojsoumsgepnk55qkm5v3eetxu2ajhlm/825.png", alt: "Hooded Syndicate #825", name: "Hooded Syndicate" },
  { src: "https://i.stargaze-apis.com/zUQQPWBbdbnX2q2KMY7sLvJ9UeWhTkpXQ3MsCpFv4rs/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeids5d5zyyerac3qvmy7mrhojsoumsgepnk55qkm5v3eetxu2ajhlm/3635.png", alt: "Hooded Syndicate #3635", name: "Hooded Syndicate" },
  { src: "https://i.stargaze-apis.com/FJK4eROpr-rH1brcSoi2R9PJYPYz9D89eSV4pp6xvnU/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeid3gtzsbgybkl2odbrqvfriaqsquutyjdp3j7vla62nxffdsvnt4e/679.png", alt: "DUBBS #679", name: "Dubbies" },
  { src: "https://i.stargaze-apis.com/wswYHzP5TJ98o6Pi_B6XjrK22_QV2TMTRahTFZ2UG6I/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeid3gtzsbgybkl2odbrqvfriaqsquutyjdp3j7vla62nxffdsvnt4e/567.png", alt: "DUBBS #567", name: "Dubbies" },
  { src: "https://i.stargaze-apis.com/cUHsQaZ8OmojeIh5nPwfTpX_5azhNBkXsSYZXwHCrq4/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeid3gtzsbgybkl2odbrqvfriaqsquutyjdp3j7vla62nxffdsvnt4e/4456.png", alt: "DUBBS #4456", name: "Dubbies" },
  { src: "https://i.stargaze-apis.com/Fe7yGkTLske9Bfen8PvZ1251ubG_y4hihxfctV4j7sc/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeid3gtzsbgybkl2odbrqvfriaqsquutyjdp3j7vla62nxffdsvnt4e/758.png", alt: "DUBBS #758", name: "Dubbies" },
  { src: "https://i.stargaze-apis.com/ySDJHfLBFPUuOvi3-bzwRxAVChRXzClPz9XlCx-H9Pg/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeid3gtzsbgybkl2odbrqvfriaqsquutyjdp3j7vla62nxffdsvnt4e/1586.png", alt: "DUBBS #1586", name: "Dubbies" },
  { src: "https://i.stargaze-apis.com/3aIRZGC0MVzIG9tjn6t1-3UpMDxv5NlwPEHyi_k5yiI/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeid3gtzsbgybkl2odbrqvfriaqsquutyjdp3j7vla62nxffdsvnt4e/723.png", alt: "DUBBS #723", name: "Dubbies" },
  { src: "https://i.stargaze-apis.com/89kmmtW23l6Q-ab3DL65tUi74H0_6hGw8PHHUI2x-_Q/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeid3gtzsbgybkl2odbrqvfriaqsquutyjdp3j7vla62nxffdsvnt4e/135.png", alt: "DUBBS #135", name: "Dubbies" },
  { src: "https://i.stargaze-apis.com/Y3nfrfObWso76VajAq0FCcWUL6walc16Rzb45SmLl5w/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeid3gtzsbgybkl2odbrqvfriaqsquutyjdp3j7vla62nxffdsvnt4e/4577.png", alt: "DUBBS #4577", name: "Dubbies" },
  { src: "https://i.stargaze-apis.com/KrJldN8osWDrxpPBlC75uijKu2kXQLbHEIVv5s8Q04g/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeid3gtzsbgybkl2odbrqvfriaqsquutyjdp3j7vla62nxffdsvnt4e/3232.png", alt: "DUBBS #3232", name: "Dubbies" },
  { src: "https://i.stargaze-apis.com/_HTvBSn4k7Qdg0rCxoN1zQC5HXl6-6bkKXVVsrmDeK4/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeid3gtzsbgybkl2odbrqvfriaqsquutyjdp3j7vla62nxffdsvnt4e/371.png", alt: "DUBBS #371", name: "Dubbies" },
  { src: "https://i.stargaze-apis.com/CjpNTZAWGHleO-ejlosqc8ajtFhg0yTtcSyNZc-I5Jc/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeigxl7tzw72t6iyxlnr6s4dk666j45kyedehkl6kbrhdru3xzo4wsq/740.png", alt: "Voyagers #740", name: "Voyagers" },
  { src: "https://i.stargaze-apis.com/cgs0sTkCYdsdDHfjI0cm31DJbYpwW_fLzc5zyTWIf6o/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeigxl7tzw72t6iyxlnr6s4dk666j45kyedehkl6kbrhdru3xzo4wsq/263.png", alt: "Voyagers #263", name: "Voyagers" },
  { src: "https://i.stargaze-apis.com/Co_SBzuGn0lYDQo-1oImlnYjmyBqjnnRyH9vT1r2dik/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeigxl7tzw72t6iyxlnr6s4dk666j45kyedehkl6kbrhdru3xzo4wsq/120.png", alt: "Voyagers #120", name: "Voyagers" },
  { src: "https://i.stargaze-apis.com/FKgCCo-aIy_ocHbOTjk_xJsDCw8cBqTq3qg7kiIZjeM/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeigxl7tzw72t6iyxlnr6s4dk666j45kyedehkl6kbrhdru3xzo4wsq/682.png", alt: "Voyagers #682", name: "Voyagers" },
  { src: "https://i.stargaze-apis.com/G696nBquH4RoeYppAWkGuY9icSsXPEIrzT9I_X-6OTc/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeigxl7tzw72t6iyxlnr6s4dk666j45kyedehkl6kbrhdru3xzo4wsq/18.png", alt: "Voyagers #18", name: "Voyagers" },
  { src: "https://i.stargaze-apis.com/ACPp8A3rq51Y2KDD8icqOb1rBA0FRrtDr1ErSTVT5r4/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeigxl7tzw72t6iyxlnr6s4dk666j45kyedehkl6kbrhdru3xzo4wsq/296.png", alt: "Voyagers #296", name: "Voyagers" },
  { src: "https://i.stargaze-apis.com/6c1XCruqq1ROrjtu1eb04gqzcAuU64zp3iI1r0cI9vM/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeigxl7tzw72t6iyxlnr6s4dk666j45kyedehkl6kbrhdru3xzo4wsq/206.png", alt: "Voyagers #206", name: "Voyagers" },
  { src: "https://i.stargaze-apis.com/P5OCOtM07ugVRNayQXTv-4SRJtMx9yvKO3q1VtxXIz8/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeigxl7tzw72t6iyxlnr6s4dk666j45kyedehkl6kbrhdru3xzo4wsq/681.png", alt: "Voyagers #681", name: "Voyagers" },
  { src: "https://i.stargaze-apis.com/pEQmx6gqwAANIPG0JaDccF-yRRC-SinTIFRFvmxbCe4/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeigxl7tzw72t6iyxlnr6s4dk666j45kyedehkl6kbrhdru3xzo4wsq/689.png", alt: "Voyagers #689", name: "Voyagers" },
  { src: "https://i.stargaze-apis.com/sWSFn9ZGsVqtHYM0LRCfb6GCly5lTPB1CBK6rGttWOQ/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeigqe3cpvrukfyhg27j3w5nhmvdqldr53sirfgnsygranoba3uyeke/2577.png", alt: "Dynamite #2577", name: "Dynamite" },
  { src: "https://i.stargaze-apis.com/eAJMeUhKuY5k1ecz6z0PU9LPt4EKanirU-JXdAKVjLI/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeigqe3cpvrukfyhg27j3w5nhmvdqldr53sirfgnsygranoba3uyeke/82.png", alt: "Dynamite #82", name: "Dynamite" },
  { src: "https://i.stargaze-apis.com/PFja86_HErkw_pAtq81GUqScC2wg4OYtCvLcbYvfPnA/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeigqe3cpvrukfyhg27j3w5nhmvdqldr53sirfgnsygranoba3uyeke/208.png", alt: "Dynamite #208", name: "Dynamite" },
  { src: "https://i.stargaze-apis.com/S0zUpHKuwk95iTRbC_hLdxm9sQ2sqMj_vdKhnpDblxs/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeigqe3cpvrukfyhg27j3w5nhmvdqldr53sirfgnsygranoba3uyeke/2224.png", alt: "Dynamite #2224", name: "Dynamite" },
  { src: "https://i.stargaze-apis.com/2eEwfd5lz2nD11mupuOzVXfUWLBVoLzdvtlyw23zWCM/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeigqe3cpvrukfyhg27j3w5nhmvdqldr53sirfgnsygranoba3uyeke/355.png", alt: "Dynamite #355", name: "Dynamite" },
  { src: "https://i.stargaze-apis.com/cLMY01WY43trd3a0UUlaJ0qaMaobQxAQjBJQ5WrmLbw/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeigqe3cpvrukfyhg27j3w5nhmvdqldr53sirfgnsygranoba3uyeke/792.png", alt: "Dynamite #792", name: "Dynamite" },
  { src: "https://i.stargaze-apis.com/9NSZ9VaXCF0iqBr7hyQQjJZshvvUgvN3M837S-5FHU8/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeigqe3cpvrukfyhg27j3w5nhmvdqldr53sirfgnsygranoba3uyeke/3417.png", alt: "Dynamite #3417", name: "Dynamite" },
  { src: "https://i.stargaze-apis.com/RCRkr27QRdWLiIc0hxFERQSe_kE9XpOC6N-8Tw8K48s/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeigqe3cpvrukfyhg27j3w5nhmvdqldr53sirfgnsygranoba3uyeke/2668.png", alt: "Dynamite #2668", name: "Dynamite" },
  { src: "https://i.stargaze-apis.com/lV17nlysUBseL-uN06KX88JIY03brO6uePlyv2ncqtE/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeigqe3cpvrukfyhg27j3w5nhmvdqldr53sirfgnsygranoba3uyeke/327.png", alt: "Dynamite #327", name: "Dynamite" },
  { src: "https://i.stargaze-apis.com/Qe-0pCTjWNzs1x9dIpx21zxfZCFL1FD54XhVkfWY9M4/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeigqe3cpvrukfyhg27j3w5nhmvdqldr53sirfgnsygranoba3uyeke/538.png", alt: "Dynamite #538", name: "Dynamite" },
  { src: "https://i.stargaze-apis.com/V2ifWA4_bsfo7JTWkWXavusWYsoFiZ9fwRtb5pfUFLU/f:jpg/resize:fit:512:::/dpr:2/plain/ipfs://bafybeigqe3cpvrukfyhg27j3w5nhmvdqldr53sirfgnsygranoba3uyeke/2930.png", alt: "Dynamite #2930", name: "Dynamite" }
];

export default function Home() {
  return (
    <div className="relative bg-black w-full overflow-hidden">
      <div className="relative">
        <Header />
        {/* <div className="bg-[url('/images/wizard.gif')] md:!hidden bg-cover bg-center h-[500px] w-full scale-125" /> */}
        <video autoPlay loop muted className="md:!hidden w-full h-full">
          <source src="/images/mobile-home.mp4" type="video/mp4" />
        </video>
        {/* <img src="/images/wizard.gif" className="md:!hidden h-screen w-full" /> */}
        <video autoPlay loop muted className="hidden md:!block w-full h-full">
          <source src="/images/Home-Odds.mp4" type="video/mp4" />
        </video>
        {/* <div className="absolute bottom-0 w-full h-[100px] bg-gradient-to-b from-transparent to-black">
          <div className="md:!hidden w-full bg-transparent px-4 py-12 text-center">
            <div className="flex justify-center"> */}
        {/* <h1 className="text-4xl md:!text-6xl text-white font-black">Stake, Win, and LFGODDS!</h1> */}
        {/* <CustomGradualSpacing
                className="font-display text-center text-4xl font-black md:leading-[5rem]"
                text="Stake, Win, and"
              />
            </div>
            <div className="flex justify-center">
              <CustomGradualSpacing
                className="font-display text-center text-4xl font-black md:leading-[5rem]"
                text="LFGODDS!"
              />
            </div>
            <div className="my-2">
              <p className="text-sm md:!text-xl text-gray-400 leading-none">Discover the ultimate NFT stake challenge</p>
              <p className="text-sm md:!text-xl text-gray-400 leading-none">Join to compete, stack the most NFTs,</p>
              <p className="text-sm md:!text-xl text-gray-400 leading-none">and win prizes.</p>
            </div>
          </div>
        </div> */}
      </div>
      {/* <div className="hidden md:!block w-full bg-black px-4 py-12 text-center"> */}
      {/* <h1 className="text-4xl md:!text-6xl text-white font-black">Stake, Win, and LFGODDS!</h1> */}
      {/* <div className="flex justify-center">
          <CustomGradualSpacing
            className="font-display text-center text-2xl md:!text-6xl font-black md:leading-[5rem] text-transparent bg-clip-text bg-gradient-to-b from-gray-300 to-white"
            text="Stake, Win, and LFGODDS!"
          />
        </div>
        <div className="mt-4">
          <p className="text-sm md:!text-xl text-gray-400 leading-none">Discover the ultimate NFT stake challenge</p>
          <p className="text-sm md:!text-xl text-gray-400 leading-none">Join to compete, stack the most NFTs, and win prizes.</p>
        </div>
      </div>
      <div className="w-full h-[125px] bg-black" />
      <div className="w-full bg-black md:mb-16">
        <StakeSection />
      </div>
      <div className="bg-[url('/images/blur-brown.png')] bg-cover bg-center mt-4 md:!mt-0">
        <Leaderboard />
        <div className="w-full relative text-white flex flex-col justify-center items-center text-center">
          <div className="mt-4 md:!mt-8 mx-20">
            <h1 className="text-[20px] md:text-[36px] font-bold">
              Prize
            </h1>
            <p className="text-[13px] md:!text-lg text-gray-400 leading-tight">
              Only the biggest stakers will claim victory and win the prize!
            </p>
          </div>
          <Carousel images={imageList} interval={15000} />
        </div>
      </div>
      <div className="bg-[url('/images/bg-line-grid.png')] bg-cover bg-center h-full py-8 md:py-16">
        <Footer className="my-0" />
      </div>*/}
    </div>
  );
}