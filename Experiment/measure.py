from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
import time
import os
from datetime import datetime, timedelta
import numpy as np
import pyautogui

# replace all xxxxxxxx to your own account, password, or path ...

def measure(driver,eid,web,isLogin,isGrant,inactive,type):

    n=0
    while n < 11:

        results = {}
        began = datetime.now()
        results["dram_0"] = open('/sys/class/powercap/intel-rapl/intel-rapl:0/intel-rapl:0:1/energy_uj').readline()
        results["core_0"] = open('/sys/class/powercap/intel-rapl/intel-rapl:0/intel-rapl:0:0/energy_uj').readline()

        driver.get(web)

        results["core_1"] = open('/sys/class/powercap/intel-rapl/intel-rapl:0/intel-rapl:0:0/energy_uj').readline()
        results["dram_1"] = open('/sys/class/powercap/intel-rapl/intel-rapl:0/intel-rapl:0:1/energy_uj').readline()
        ended = datetime.now()
            
        if 'video' in type:
            results["dram_5"] = open('/sys/class/powercap/intel-rapl/intel-rapl:0/intel-rapl:0:1/energy_uj').readline()
            results["core_5"] = open('/sys/class/powercap/intel-rapl/intel-rapl:0/intel-rapl:0:0/energy_uj').readline()

            time.sleep(120)

            results["core_5a"] = open('/sys/class/powercap/intel-rapl/intel-rapl:0/intel-rapl:0:0/energy_uj').readline()
            results["dram_5a"] = open('/sys/class/powercap/intel-rapl/intel-rapl:0/intel-rapl:0:1/energy_uj').readline()
        else:
            results["dram_5"] = open('/sys/class/powercap/intel-rapl/intel-rapl:0/intel-rapl:0:1/energy_uj').readline()
            results["core_5"] = open('/sys/class/powercap/intel-rapl/intel-rapl:0/intel-rapl:0:0/energy_uj').readline()

            time.sleep(60)

            results["core_5a"] = open('/sys/class/powercap/intel-rapl/intel-rapl:0/intel-rapl:0:0/energy_uj').readline()
            results["dram_5a"] = open('/sys/class/powercap/intel-rapl/intel-rapl:0/intel-rapl:0:1/energy_uj').readline()

        tuse = ended - began
        core = (float(results["core_1"]) - float(results["core_0"])) * 1e-3
        dram = (float(results["dram_1"]) - float(results["dram_0"])) * 1e-3
        core_5 = (float(results["core_5a"]) - float(results["core_5"])) * 1e-3
        dram_5 = (float(results["dram_5a"]) - float(results["dram_5"])) * 1e-3
        tstamp = (began - datetime(1970, 1, 1)) / timedelta(seconds=1)

        time.sleep(1)
        driver.delete_all_cookies()
        time.sleep(1)
        try:
            driver.execute_script('localStorage.clear();')
            driver.execute_script('caches.delete();')
        except:
            try:
                driver.execute_script('localStorage.clear();')
            except:
                try:
                    driver.execute_script('caches.delete();')
                except:
                    continue

        type = 'free' if 'free' in type else 'notGrant' if (isGrant==0 and isLogin==1 and inactive==0) else 'notLogin' if (isGrant==1 and isLogin==0 and inactive==0)  else 'inactive' if (isGrant==1 and isLogin==1 and inactive==1) else 'fullyInactive' if (isGrant==0 and isLogin==0 and inactive==1)  else 'clean' if (isGrant==0 and isLogin==0 and inactive==0)  else 'full' if 'full' in type else ''
        if core >0 and dram>0 and core_5>0 and dram_5>0 and n != 0:
            os.system(f'echo {eid} >> {type}.txt')
            os.system(f'echo {tstamp} >> {type}.txt')
            os.system(f'echo {tuse.total_seconds()} >> {type}.txt')
            os.system(f'echo {core} >> {type}.txt')
            os.system(f'echo {dram} >> {type}.txt')
            os.system(f'echo {core_5} >> {type}.txt')
            os.system(f'echo {dram_5} >> {type}.txt')
            n+=1
        else:
            if core >0 and dram>0 and core_5>0 and dram_5>0 and n == 0:
                n +=1

        time.sleep(1)

def close_poped(driver):
    driver.execute_script("window.open('');")
    time.sleep(2)
    driver.close()
    window_before = driver.window_handles[0]
    driver.switch_to.window(window_before) 
    time.sleep(1)
    driver.delete_all_cookies()
    driver.execute_script('localStorage.clear();')
    driver.execute_script('caches.delete();')
    driver.close()
    window_before = driver.window_handles[0]
    driver.switch_to.window(window_before)
    return driver

def open_driver(label,eid):
    opt = Options()
    #To prevent Selenium driven WebDriver getting detected a niche approach would include
    opt.add_argument('--disable-blink-features=AutomationControlled')
    if eid != 'free':
        opt.add_extension(f'/xxxxxxxx/crx/{label}/{eid}.crx')
    s=Service('/xxxxxxxx/chromedriver')
    return webdriver.Chrome(service=s,options=opt)

def full_set(label,eid,isLogin,isGrant,inactive):
    driver = open_driver(label,eid)
    # print(eid)
    # print('Grant: ', 'Y' if eid in grant else 'N')
    # print('Login: ', 'Y' if eid in login else 'N')
    #0
    if eid == 'fmidkjgknpkbmninbmklhcgaalfalbdh':
        # Use Immersive Reader on Websites
        for web in webs['generic']:

            driver.execute_script("window.open('');")
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)

            if isGrant:
                driver.get(web)
                #grant
                pyautogui.click(x=1170,y=110, clicks=1)
                time.sleep(1)
                pyautogui.click(x=1050,y=270)
                pyautogui.click(x=1120,y=150)
                
                driver.delete_all_cookies()
                driver.execute_script('localStorage.clear();')
                driver.execute_script('caches.delete();')
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')
        
    elif eid == 'ffnhmkgpdmkajhomnckhabkfeakhcamm':
        # Tumblr – Post to Tumblr
        # note taker
        if isLogin:
            driver.get(f'https://www.aliexpress.com')
            #click once
            pyautogui.click(x=1170,y=110, clicks=1)
            time.sleep(1)
            pyautogui.click(x=1050,y=270)
            time.sleep(10)
            pyautogui.write('xxxxxxxx@gmail.com')  
            pyautogui.press('tab') 
            #enter pwd
            pyautogui.write('xxxxxxxx') 

            pyautogui.press(['enter'])
            time.sleep(20)
            with pyautogui.hold('ctrl'):
                pyautogui.press(['w'])
            pyautogui.press(['enter'])
        for web in webs['generic']:

            driver.execute_script("window.open('');")
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            if isGrant:
                driver.get(web)
                #grant
                pyautogui.click(x=1170,y=110, clicks=1)
                time.sleep(1)
                pyautogui.click(x=1050,y=270)

                with pyautogui.hold('ctrl'):
                    pyautogui.press(['w'])
                pyautogui.press(['enter'])
                driver.delete_all_cookies()
                driver.execute_script('localStorage.clear();')
                driver.execute_script('caches.delete();')

            measure(driver,eid,web,isLogin,isGrant,inactive,'full')
    elif eid == 'gppongmhjkpfnbhagpmjfkannfbllamg':
        # Wappalyzer - Technology profiler
        # To find out what CMS a website is using, as well as any framework, ecommerce platform, JavaScript libraries and many more.
        driver = close_poped(driver)
        

        for web in webs['generic']:

            driver.execute_script("window.open('');")
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')
    elif eid == 'iginnfkhmmfhlkagcmpgofnjhanpmklb':
        # Boxel Rebound
        # plugin game
        for web in webs['generic']:
            driver.execute_script("window.open('');")
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')
    elif eid == 'kpghljlpdknmomchobaoecdlkcpocaga':
        # Naver/Daum Media Filter(네이버/다음 뉴스 언론사 표시/차단)
        #news filter blocking unfavors/selecting favors in Naver/Daum
        
        for web in webs['generic'] if inactive else webs['news']:
            driver.execute_script("window.open('');")
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')
    elif eid == 'lamfengpphafgjdgacmmnpakdphmjlji':
        # Bulk Image Downloader
        for web in webs['generic']:
            driver.execute_script("window.open('');")
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')

    elif eid == 'gpdjojdkbbmdfjfahjcgigfpmkopogic':
        # Pinterest Save button
        driver = close_poped(driver)

        for web in webs['generic']:
            driver.execute_script("window.open('');")
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')

    elif eid == 'bmhcbmnbenmcecpmpepghooflbehcack':
        # LINER - Search Faster & Highlight Web/Youtube
        driver = close_poped(driver)

        for web in webs['generic']:
            driver.execute_script("window.open('');")
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')
    
    elif eid == 'pgmbeccjfkdbpdjfoldaahpfamjjafma':
        # 買い物ポケット
        # amazon.co.jp/yahoo/楽天市場 https://www.rakuten.co.jp/
        for web in webs['shoppingjp']:
            driver.execute_script("window.open('');")
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')
    
    elif eid == 'cimpffimgeipdhnhjohpbehjkcdpjolg':
        # Watch2Gether
        # share content from Youtube, Vimeo, Dailymotion
        if isLogin:
            driver.get(f'https://www.amazon.ca')
            pyautogui.click(x=1170,y=110, clicks=1)
            time.sleep(1)
            pyautogui.click(x=1050,y=270)
            time.sleep(1)
            pyautogui.click(x=850,y=305)
            pyautogui.write('xxxxxxxx.use@gmail.com')  
            pyautogui.press('tab') 
            #enter pwd
            pyautogui.write('xxxxxxxx') 
            pyautogui.click(x=850,y=405)
            pyautogui.click(x=1170,y=150)

            driver.delete_all_cookies()
            driver.execute_script('localStorage.clear();')
            driver.execute_script('caches.delete();')
        #start measurement - Test 10 YouTube videos
        for web in webs['video_youtube']:

            driver.execute_script("window.open('');")
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full_video')

    
    elif eid == 'ahcblhpcealjpkmndgmkdnebbjakicno':
        # LM Note Generator For ESPN Fantasy Football
        for web in webs['espn']:
            driver.execute_script("window.open('');")
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')


    #1
    elif eid == 'gmopgnhbhiniibbiilmbjilcmgaocokj':
        # NekoCap
        if isLogin:
            driver.get(f'https://www.youtube.com')
            pyautogui.click(x=1170,y=110, clicks=1)
            time.sleep(1)
            pyautogui.click(x=1050,y=270)

            time.sleep(1)
            pyautogui.click(x=910,y=310)
            time.sleep(3)
            pyautogui.click(x=535,y=835)
            pyautogui.write('xxxxxxxx.use@gmail.com')  
            pyautogui.press('enter') 
            time.sleep(5)
            window_before = driver.window_handles[1]
            driver.switch_to.window(window_before)
            time.sleep(1)
            while len(driver.find_elements("xpath",'//div/input[@name="hiddenPassword"]'))>0:
                captcha = str(input()).strip()
                WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.XPATH, '//div/div/div/div/div/div/input[@aria-label="Type the text you hear or see"]'))).send_keys(f'{captcha}')
                WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.XPATH, '//div/button/span[text()="Next"]'))).click()
                time.sleep(2)
                #enter pwd
                WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.XPATH, '//div/input[@name="password"]'))).send_keys('xxxxxxxx')
                WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.XPATH, '//div/button/span[text()="Next"]'))).click()
                pyautogui.click(x=1120,y=150)
                time.sleep(3)
                with pyautogui.hold('ctrl'):
                    pyautogui.press(['w'])
                window_before = driver.window_handles[0]
                driver.switch_to.window(window_before)

                driver.switch_to.window(window_before)

                driver.delete_all_cookies()
                driver.execute_script('localStorage.clear();')
                driver.execute_script('caches.delete();')
                time.sleep(1)
                window_before = driver.window_handles[1]
                driver.switch_to.window(window_before)
                driver.close()
                window_before = driver.window_handles[0]
                driver.switch_to.window(window_before)
            WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.XPATH, '//div/input[@name="password"]'))).send_keys('xxxxxxxx')
            WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.XPATH, '//div/button/span[text()="Next"]'))).click()
            pyautogui.click(x=1120,y=150)
            time.sleep(3)
            with pyautogui.hold('ctrl'):
                pyautogui.press(['w'])
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            driver.delete_all_cookies()
            driver.execute_script('localStorage.clear();')
            driver.execute_script('caches.delete();')
            
            # Log out google
            pyautogui.click(x=1235,y=115)
            pyautogui.click(x=1025,y=415)
            time.sleep(1)
            window_before = driver.window_handles[1]
            driver.switch_to.window(window_before)
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)

            driver.delete_all_cookies()
            driver.execute_script('localStorage.clear();')
            driver.execute_script('caches.delete();')
        # 10 youtube
        for web in webs['generic'] if inactive else webs['video_youtube']:

            driver.execute_script("window.open('');")
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full_video')

    elif eid == 'ffjnfifmelbmglnajefiipdeejghkkjg':
        # webpage cloner
        driver = close_poped(driver)

        for web in webs['generic']:
            driver.execute_script("window.open('');")
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')

    elif eid == 'bkhaagjahfmjljalopjnoealnfndnagc':
        # Octotree - GitHub code tree

        #target to code review on Github
        for web in webs['github']:
            driver.execute_script("window.open('');")
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')


    elif eid == 'ikdgincnppajmpmnhfheflannaiapmlm':
        # Ampie
        if isLogin:
            while len(driver.window_handles) <= 1:
                time.sleep(1)
            window_before = driver.window_handles[1]
            driver.switch_to.window(window_before)
            driver.get(f'https://ampie.app/login')
            WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.XPATH, '//div/form/input[@placeholder="Username"]'))).send_keys('xxxxxxxx.use@gmail.com')
            WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.XPATH, '//div/form/input[@placeholder="Password"]'))).send_keys('xxxxxxxx')
            WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.XPATH, '//div/form/button[text()="Log in"]'))).click()
            time.sleep(5)

            driver.delete_all_cookies()
            driver.execute_script('localStorage.clear();')
            driver.execute_script('caches.delete();')

            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
        else:
            driver = close_poped(driver)

        for web in webs['generic']:
            driver.execute_script("window.open('');")
            driver.close()
        
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')
        
    
    elif eid == 'kfimphpokifbjgmjflanmfeppcjimgah':
        # RSS Reader Extension (by Inoreader)
        driver = close_poped(driver)

        driver.get(f'https://www.aliexpress.com')
        if isLogin:
            #need to sign in
            pyautogui.click(x=1170,y=110, clicks=1)
            time.sleep(1)
            pyautogui.click(x=1050,y=270)
            pyautogui.click(x=1080,y=260)
            time.sleep(0.5)
            window_before = driver.window_handles[1]
            driver.switch_to.window(window_before)
            WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.XPATH, '//div/input[@id="username"]'))).send_keys('xxxxxxxx@gmail.com')
            WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.XPATH, '//div/input[@id="password"]'))).send_keys('xxxxxxxx')
            WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.XPATH, '//button[text()="Sign in"]'))).click()
            
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)

        for web in webs['generic']:

            driver.execute_script("window.open('');")
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)

            if isGrant:
                driver.get(web)
                #grant
                pyautogui.click(x=1170,y=110, clicks=1)
                time.sleep(1)
                pyautogui.click(x=1050,y=270)
                pyautogui.click(x=1120,y=150)

                driver.delete_all_cookies()
                driver.execute_script('localStorage.clear();')
                driver.execute_script('caches.delete();')
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')

    elif eid == 'lcpkicdemehhmkjolekhlglljnkggfcf':
        # imgur Uploader
        
        for web in webs['generic']:

            driver.execute_script("window.open('');")
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)

            if isGrant:
                driver.get(web)
                #grant
                pyautogui.click(x=1170,y=110, clicks=1)
                time.sleep(1)
                pyautogui.click(x=1050,y=270)
                pyautogui.click(x=1120,y=150)

                driver.delete_all_cookies()
                driver.execute_script('localStorage.clear();')
                driver.execute_script('caches.delete();')
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')
            

    elif eid == 'nngceckbapebfimnlniiiahkandclblb':
        # Bitwarden - Free Password Manager
        driver = close_poped(driver)

        if isLogin:
            driver.get(f'https://www.aliexpress.com')
            pyautogui.click(x=1170,y=110, clicks=1)
            time.sleep(1)
            pyautogui.click(x=1050,y=270)
            time.sleep(1)
            pyautogui.click(x=955,y=435)
            time.sleep(1)
            pyautogui.write('xxxxxxxx@gmail.com') 
            #enter pwd
            pyautogui.click(x=820,y=290)
            pyautogui.write('xxxxxxxx') 
            pyautogui.click(x=1120,y=150)
            time.sleep(2)
            pyautogui.click(x=845,y=355)
            time.sleep(1)
            pyautogui.click(x=1120,y=150)
            pyautogui.click(x=1170,y=150)

            driver.delete_all_cookies()
            driver.execute_script('localStorage.clear();')
            driver.execute_script('caches.delete();')
        for web in webs['generic']:

            driver.execute_script("window.open('');")
            driver.close()
        
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')


    elif eid == 'naankklphfojljboaokgfbheobbgenka':
        # CiteMaker CiteWeb | APA 7th Edn.

        for web in webs['generic']:

            driver.execute_script("window.open('');")
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)

            if isGrant:
                driver.get(web)
                #grant
                pyautogui.click(x=1170,y=110, clicks=1)
                time.sleep(1)
                pyautogui.click(x=1050,y=270)
                pyautogui.click(x=1050,y=150)

                driver.delete_all_cookies()
                driver.execute_script('localStorage.clear();')
                driver.execute_script('caches.delete();')
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')

    elif eid == 'fhjanlpjlfhhbhbnjohflphmfccbhmoi':
        # Elfster's Elf It!
        # wishlist
        # login
        if isLogin:
            driver.get(f'https://www.aliexpress.com')
            pyautogui.click(x=1170,y=110, clicks=1)
            time.sleep(1)
            pyautogui.click(x=1050,y=270)
            time.sleep(2)
            pyautogui.click(x=550,y=305)
            # time.sleep(0.5)

            window_before = driver.window_handles[1]
            driver.switch_to.window(window_before)
            WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.XPATH, '//div/input[@id="Username"]'))).send_keys('xxxxxxxx@gmail.com')
            WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.XPATH, '//div/input[@id="Password"]'))).send_keys('xxxxxxxx')
            WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.XPATH, '//button[text()="Sign In"]'))).click()
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            # driver.get(f'https://www.aliexpress.com')

        
        for web in webs['shoppingjp']:

            driver.execute_script("window.open('');")
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            if isGrant:
                driver.get(web)
                #grant
                pyautogui.click(x=1170,y=110, clicks=1)
                time.sleep(1)
                pyautogui.click(x=1050,y=270)
                pyautogui.click(x=1050,y=150)

                driver.delete_all_cookies()
                driver.execute_script('localStorage.clear();')
                driver.execute_script('caches.delete();')
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')

    elif eid == 'bkkjeefjfjcfdfifddmkdmcpmaakmelp':
        # Truffle.TV (formerly known as Mogul.TV)
        # Enhance YouTube / Twitch vids
        driver.get(f'https://www.amazon.ca') 
        pyautogui.click(x=1170,y=110, clicks=1)
        time.sleep(1)
        pyautogui.click(x=1050,y=270)
        #turn on the option
        pyautogui.click(x=790,y=260)
        pyautogui.click(x=1170,y=150)
        
        driver.delete_all_cookies()
        driver.execute_script('localStorage.clear();')
        driver.execute_script('caches.delete();')
        #start measurement - 5+5  YouTube / Twitch vids
        for web in webs['video_youtube']:

            driver.execute_script("window.open('');")
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full_video')


    elif eid == 'lokmacldfjfgajcebibmmfohacnikhhd':
        # RotoGrinders - DraftKings Tools
        # stock
        if isLogin:
            # login
            driver.get(f'https://sportsbook.draftkings.com/featured')

            pyautogui.click(x=1170,y=110, clicks=1)
            time.sleep(1)
            pyautogui.click(x=1050,y=270)

            #enter account
            pyautogui.click(x=970,y=162, clicks=3,interval=0.5)
            pyautogui.write('xxxxxxxx@gmail.com')  
            #enter pwd
            pyautogui.click(x=970, y=210, clicks=1)
            pyautogui.write('xxxxxxxx') 
            pyautogui.click(x=990,y=240) #alert
            time.sleep(1)
            pyautogui.click(x=1470,y=880) 

            driver.delete_all_cookies()
            driver.execute_script('localStorage.clear();')
            driver.execute_script('caches.delete();')
        # measurement at draftkings
        for web in webs['generic'] if inactive else webs['draftkings']:
            driver.execute_script("window.open('');")
            driver.close()
        
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')
        

    #2
    elif eid == 'alncdjedloppbablonallfbkeiknmkdi':
        # Dark Mode - Night Eye
        driver = close_poped(driver)

        driver.get(f'https://www.aliexpress.com')
        pyautogui.click(x=1170,y=110, clicks=1)
        time.sleep(1)
        pyautogui.click(x=1050,y=270)

        pyautogui.click(x=1000,y=605)
        pyautogui.click(x=1170,y=150)

        driver.delete_all_cookies()
        driver.execute_script('localStorage.clear();')
        driver.execute_script('caches.delete();')
        # start measurement on webs
        for web in webs['generic']:
            driver.execute_script("window.open('');")
            driver.close()
        
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')

    elif eid == 'pkihbahhbihfoebgdfkibnblbhjfgefc':
        # Free Best VPN PC-Chrome-Unlimited Proxy Guide
        for web in webs['generic'] if inactive else webs['apk']:
            driver.execute_script("window.open('');")
            driver.close()
        
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')
        

    elif eid == 'dapjbgnjinbpoindlpdmhochffioedbn':
        # BuiltWith Technology Profiler
        # To find out what CMS a website is using, as well as any framework, ecommerce platform, JavaScript libraries and many more.
        if isLogin:
            driver.get(f'https://www.aliexpress.com')
            pyautogui.click(x=1170,y=110, clicks=1)
            time.sleep(1)
            pyautogui.click(x=1050,y=270)

            #enter account
            time.sleep(1)
            pyautogui.click(x=695,y=145)
            # pyautogui.displayMousePosition()
            while(len(driver.window_handles)==1):
                pyautogui.click(x=1170,y=110, clicks=1)
                time.sleep(1)
                pyautogui.click(x=1050,y=270)

                pyautogui.click(x=840,y=415)
                pyautogui.write('cat')
                pyautogui.press('enter') 
                time.sleep(4)
                pyautogui.click(x=695,y=145)
            # driver.get(f'https://builtwith.com/login')


            window_before = driver.window_handles[1]
            driver.switch_to.window(window_before)
            WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.XPATH, '//div/input[@id="email"]'))).send_keys('xxxxxxxx@gmail.com')
            WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.XPATH, '//div/input[@id="password"]'))).send_keys('xxxxxxxx')
            
            captcha = driver.find_element("xpath",'//div[@class="mb-4"]/label/strong').get_attribute('textContent')
            WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.XPATH, f'//div/img[contains(@id,"{captcha}")]'))).click()
            WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.XPATH, f'//div/input[@value="Login"]'))).click()

            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)

            driver.delete_all_cookies()
            driver.execute_script('localStorage.clear();')
            driver.execute_script('caches.delete();')

        for web in webs['generic']:
            driver.execute_script("window.open('');")
            driver.close()
        
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')

    elif eid == 'fadndhdgpmmaapbmfcknlfgcflmmmieb':
        # FrankerFaceZ
        # 20 Twitch
        for web in webs['generic'] if inactive else webs['video_twitch']:
            driver.execute_script("window.open('');")
            driver.close()
        
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full_video')
    elif eid == 'iolcbmjhmpdheggkocibajddahbeiglb':
        # Weather
        driver = close_poped(driver)

        for web in webs['generic']:
            driver.execute_script("window.open('');")
            driver.close()
        
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')
    elif eid == 'mpejojclnbakefnlfmnkaaianojbicdk':
        # WAM: WordSeeker
        # new tab
        for web in webs['generic']:
            driver.execute_script("window.open('');")
            driver.close()
        
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')
    elif eid == 'mmeijimgabbpbgpdklnllpncmdofkcpn':
        # Screencastify - Screen Video Recorder
        # screen record
        if isLogin:
            driver.get(f'https://www.aliexpress.com')
            pyautogui.click(x=1170,y=110, clicks=1)
            time.sleep(1)
            pyautogui.click(x=1050,y=270)
            #need to login google
            time.sleep(4)
            window_before = driver.window_handles[1]
            driver.switch_to.window(window_before)
            WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.XPATH, '//button/span[text()=" Sign in with Google "]'))).click()
            # pyautogui.click(x=700,y=450)
            time.sleep(2)
            pyautogui.write('xxxxxxxx@gmail.com')  
            pyautogui.press('enter')
            time.sleep(1)
            window_before = driver.window_handles[2]
            driver.switch_to.window(window_before)
            while len(driver.find_elements("xpath",'//div/input[@name="hiddenPassword"]'))>0:
                    captcha = str(input()).strip()
                    WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.XPATH, '//div/div/div/div/div/div/input[@aria-label="Type the text you hear or see"]'))).send_keys(f'{captcha}')
                    WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.XPATH, '//div/button/span[text()="Next"]'))).click()
                    time.sleep(2)
            WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.XPATH, '//div/input[@name="password"]'))).send_keys('xxxxxxxx')
            WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.XPATH, '//div/button/span[text()="Next"]'))).click()
            time.sleep(4)
            pyautogui.scroll(-20)
            pyautogui.click(x=1400,y=950)
            window_before = driver.window_handles[1]
            driver.switch_to.window(window_before)
            driver.close()

            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            # Log out google
            pyautogui.click(x=1235,y=115)
            pyautogui.click(x=1025,y=415)
            time.sleep(1)
            window_before = driver.window_handles[1]
            driver.switch_to.window(window_before)
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)

            driver.delete_all_cookies()
            driver.execute_script('localStorage.clear();')
            driver.execute_script('caches.delete();')
            
        for web in webs['generic']:
            driver.execute_script("window.open('');")
            driver.close()
        
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')

    elif eid == 'aookogakccicaoigoofnnmeclkignpdk':
        # Neeva Search + Protect for Chrome
        driver = close_poped(driver)

        for web in webs['generic']:
            driver.execute_script("window.open('');")
            driver.close()
        
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')

    elif eid == 'neebplgakaahbhdphmkckjjcegoiijjo':
        # Keepa - Amazon Price Tracker
        # amazon price hitory
        # 20 amazon good pages

        for web in webs['generic'] if inactive else webs['shoppingjp']:
            driver.execute_script("window.open('');")
            driver.close()
        
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')


    elif eid == 'jicldjademmddamblmdllfneeaeeclik':
        # OkTools

        for web in webs['generic'] if inactive else webs['oktool']:
            driver.execute_script("window.open('');")
            driver.close()
        
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')

    elif eid == 'mlfkmhibffpoleieiomjkekmjipdekhg':
        # Aerobi - Enhance Your YouTube Workouts
        # start measurement - 10  YouTube
        if isLogin:
            # login
            driver.get(f'https://www.youtube.com/watch?v=2Vv-BfVoq4g')

            pyautogui.click(x=1170,y=110, clicks=1)
            time.sleep(1)
            pyautogui.click(x=1050,y=270)
            time.sleep(1)
            pyautogui.click(x=1000,y=215)
            time.sleep(2)

            pyautogui.click(x=1230,y=810)
            pyautogui.write('xxxxxxxx@gmail.com')
            time.sleep(1)  
            pyautogui.press('enter')
            pyautogui.write('xxxxxxxx')
            pyautogui.press('enter')
            time.sleep(4)

            driver.delete_all_cookies()
            driver.execute_script('localStorage.clear();')
            driver.execute_script('caches.delete();')

            driver.get(f'https://www.google.com')

            driver.delete_all_cookies()
            driver.execute_script('localStorage.clear();')
            driver.execute_script('caches.delete();')
            
        for web in webs['video_youtube']:

            driver.execute_script("window.open('');")
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)

            if isGrant:
                driver.get(web)
                #grant
                pyautogui.click(x=1140,y=110, clicks=1)
                time.sleep(1)
                pyautogui.click(x=1050,y=270)
                pyautogui.click(x=1050,y=150)

                driver.delete_all_cookies()
                driver.execute_script('localStorage.clear();')
                driver.execute_script('caches.delete();')
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full_video')


    # 3
    elif eid == 'kammdlphdfejlopponbapgpbgakimokm':
        # Automation 360
        for web in webs['generic']:
            driver.execute_script("window.open('');")
            driver.close()
        
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')

    elif eid == 'fnhmjceoafkkibpijbfpfajbhkknadmb':
        # Tricky Enough
        for web in webs['generic'] if inactive else webs['tricky']:
            driver.execute_script("window.open('');")
            driver.close()
        
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')
        
    elif eid == 'fklgmciohehgadlafhljjhgdojfjihhk':
        # Dynatrace Real User Monitoring
        for web in webs['generic']:
            driver.execute_script("window.open('');")
            driver.close()
        
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')
    elif eid == 'jpefkkpmalfnilnbghfnjodceifpemdb':
        # ER-help Extension
        for web in webs['ereality']:
            driver.execute_script("window.open('');")
            driver.close()
        
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')
        
    elif eid == 'pgfokhpgehbmeifbpdhegfnpaahabfja':
        # The Newsroom Beta
        for web in webs['news']:
            driver.execute_script("window.open('');")
            driver.close()
        
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')

    elif eid == 'aiiimepjikpdipbpmknolbnjbeohbmaa':
        # Picwatermark
        for web in webs['generic']:
            driver.execute_script("window.open('');")
            driver.close()
        
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')
    elif eid == 'jbebkmmlkhioeagiekpopmeecaepaihd':
        # Enablement Assistant
        for web in webs['generic']:
            driver.execute_script("window.open('');")
            driver.close()
        
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')

    elif eid == 'didkfdopbffjkpolefhpcjkohcpalicd':
        # AmazingHiring
        if isLogin:
            driver.get(f'https://www.amazon.ca')
            window_before = driver.window_handles[1]
            driver.switch_to.window(window_before)
            WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.XPATH, '//button[@id="agree"]'))).click()
            time.sleep(3)
            window_before = driver.window_handles[1]
            driver.switch_to.window(window_before)
            WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.XPATH, '//div/input[@id="email"]'))).send_keys('xxxxxxxx.use@gmail.com')
            pyautogui.press('tab')
            pyautogui.write('123Dr.ZouSEAL')  
            pyautogui.press('enter')
            driver.delete_all_cookies()
            driver.execute_script('localStorage.clear();')
            driver.execute_script('caches.delete();')

            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)

            pyautogui.click(x=1170,y=110, clicks=1)
            time.sleep(1)
            pyautogui.click(x=1050,y=270)
            pyautogui.click(x=200,y=310)

            driver.delete_all_cookies()
            driver.execute_script('localStorage.clear();')
            driver.execute_script('caches.delete();')

        for web in webs['generic']:
            driver.execute_script("window.open('');")
            driver.close()
        
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')

    elif eid == 'pbjikboenpfhbbejgkoklgkhjpfogcam':
        # amazon assistant
        # must direct to amazon
        if isLogin:
            driver.get(f'https://www.amazon.co.jp')
            time.sleep(2)
            if(len(driver.window_handles)>1):
                window_before = driver.window_handles[1]
                driver.switch_to.window(window_before)
                driver.close()
                window_before = driver.window_handles[0]
                driver.switch_to.window(window_before)
            pyautogui.click(x=1170,y=110, clicks=1)
            time.sleep(1)
            pyautogui.click(x=1050,y=270)
            time.sleep(1)
            pyautogui.click(x=1125,y=150)
            time.sleep(3)
            pyautogui.click(x=1000,y=690)
            time.sleep(1)
            pyautogui.click(x=1000,y=465)
            time.sleep(1)

            window_before = driver.window_handles[1]
            driver.switch_to.window(window_before)
            WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.XPATH, '//div/input[@name="email"]'))).send_keys('xxxxxxxx@gmail.com')
            WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.XPATH, '//div/input[@name="password"]'))).send_keys('xxxxxxxx')

            WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.XPATH, '//div/span/span/input[@id="signInSubmit"]'))).click()
            time.sleep(1)
            if(len(driver.find_elements("xpath",'//div/div/div/a[contains(@text(),"Not now")]'))>1):
                driver.find_element("xpath",'//div/div/div/a[contains(@text(),"Not now")]').click()
            time.sleep(4)
        
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            driver.get(f'https://www.amazon.co.jp')
            # 10 amazon pages
            driver.delete_all_cookies()
            driver.execute_script('localStorage.clear();')
            driver.execute_script('caches.delete();')

        for web in webs['shoppingjp']:
            driver.execute_script("window.open('');")
            driver.close()
        
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')
        


    elif eid == 'mhkhmbddkmdggbhaaaodilponhnccicb':
        # TubeBuddy
        driver = close_poped(driver)

        # start measurement - 10  YouTube
        for web in webs['generic'] if inactive else webs['video_youtube']:
            driver.execute_script("window.open('');")
            driver.close()
        
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full_video')
    elif eid == 'lipplpkgbnhdfdchoibgafjdblpjdkpi':
        # Lichess Opponent Form
        for web in webs['generic'] if inactive else webs['lichess']:
            driver.execute_script("window.open('');")
            driver.close()
        
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')
        

    # 4
    elif eid == 'bkpenclhmiealbebdopglffmfdiilejc':
        # Tab Resize - split screen layouts
        driver.get(f'https://www.aliexpress.com')
        pyautogui.click(x=1170,y=110, clicks=1)
        time.sleep(1)
        pyautogui.click(x=1050,y=270)
        time.sleep(1)
        pyautogui.click(x=840,y=640)
        time.sleep(1)
        pyautogui.click(x=840,y=640)

        pyautogui.click(x=1170,y=150)
        driver.get(f'https://www.aliexpress.com')
        pyautogui.click(x=1170,y=110, clicks=1)
        time.sleep(1)
        pyautogui.click(x=1050,y=270)
        time.sleep(1)
        pyautogui.click(x=840,y=640)

        driver.delete_all_cookies()
        driver.execute_script('localStorage.clear();')
        driver.execute_script('caches.delete();')
        for web in webs['generic']:
            driver.execute_script("window.open('');")
            driver.close()
        
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')
    elif eid == 'lnphplhkejidgcncalbkbngbiafmjnml':
        # A dónde Viajar
        for web in webs['generic']:
            driver.execute_script("window.open('');")
            driver.close()
        
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')
    elif eid == 'dgjhfomjieaadpoljlnidmbgkdffpack':
        # Sourcegraph
        driver = close_poped(driver)
        # 10 GitHub
        for web in webs['github']:

            driver.execute_script("window.open('');")
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')
    elif eid == 'hcbddpppkcnfjifbcfnhmelpemdoepkk':
        # coffeelings
        for web in webs['generic']:
            driver.execute_script("window.open('');")
            driver.close()
        
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')
    elif eid == 'kgaebnfbgpcnglnhjhglinfiecgccfij':
        # Inforness
        for web in webs['generic']:
            driver.execute_script("window.open('');")
            driver.close()
        
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')
    elif eid == 'iedjpcecgmldlnkbojiocmdaedhepbpn':
        # Stem Player Album Upload
        
        for web in webs['generic']:

            driver.execute_script("window.open('');")
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)

            if isGrant:
                driver.get(web)
                #grant
                pyautogui.click(x=1170,y=110, clicks=1)
                time.sleep(1)
                pyautogui.click(x=1050,y=270)
                pyautogui.click(x=1200,y=150)

                driver.delete_all_cookies()
                driver.execute_script('localStorage.clear();')
                driver.execute_script('caches.delete();')
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')
    elif eid == 'nkbihfbeogaeaoehlefnkodbefgpgknn':
        # MetaMask
        if isLogin:
            driver.get(f'https://www.aliexpress.com')
            time.sleep(2)
            if len(driver.find_elements("xpath",'//button[@id="critical-error-button"]')) >0:
                window_before = driver.window_handles[0]
                driver.switch_to.window(window_before)
                WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.XPATH, '//button[@id="critical-error-button"]'))).click()
                window_before = driver.window_handles[0]
                driver.switch_to.window(window_before)
            
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            WebDriverWait(driver, 30).until(EC.presence_of_element_located((By.XPATH, '//button[text()="Get Started"]'))).click()
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, '//button[text()="I Agree"]'))).click()
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, '//button[text()="Import wallet"]'))).click()

            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, '//input[@id="import-srp__srp-word-0"]'))).send_keys("xxxxxxxx")
            driver.find_element("xpath",'//input[@id="import-srp__srp-word-1"]').send_keys("xxxxxxxx")
            driver.find_element("xpath",'//input[@id="import-srp__srp-word-2"]').send_keys("xxxxxxxx")
            driver.find_element("xpath",'//input[@id="import-srp__srp-word-3"]').send_keys("xxxxxxxx")
            driver.find_element("xpath",'//input[@id="import-srp__srp-word-4"]').send_keys("xxxxxxxx")
            driver.find_element("xpath",'//input[@id="import-srp__srp-word-5"]').send_keys("xxxxxxxx")
            driver.find_element("xpath",'//input[@id="import-srp__srp-word-6"]').send_keys("xxxxxxxx")
            driver.find_element("xpath",'//input[@id="import-srp__srp-word-7"]').send_keys("xxxxxxxx")
            driver.find_element("xpath",'//input[@id="import-srp__srp-word-8"]').send_keys("xxxxxxxx")
            driver.find_element("xpath",'//input[@id="import-srp__srp-word-9"]').send_keys("xxxxxxxx")
            driver.find_element("xpath",'//input[@id="import-srp__srp-word-10"]').send_keys("xxxxxxxx")
            driver.find_element("xpath",'//input[@id="import-srp__srp-word-11"]').send_keys("xxxxxxxx")

            driver.find_element("xpath",'//input[@id="password"]').send_keys("xxxxxxxx")
            driver.find_element("xpath",'//input[@id="confirm-password"]').send_keys("xxxxxxxx")

            driver.find_element("xpath",'//input[@id="create-new-vault__terms-checkbox"]').click()
            driver.find_element("xpath",'//button[@class="button btn--rounded btn-primary create-new-vault__submit-button"]').click()

            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, '//button[@class="button btn--rounded btn-primary first-time-flow__button"]'))).click()

            driver.delete_all_cookies()
            driver.execute_script('localStorage.clear();')
            driver.execute_script('caches.delete();')

            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)

            driver.delete_all_cookies()
            driver.execute_script('localStorage.clear();')
            driver.execute_script('caches.delete();')
        else:
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)

        for web in webs['generic']:

            driver.execute_script("window.open('');")
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')

    elif eid == 'eedlgdlajadkbbjoobobefphmfkcchfk':
        # Ecosia - The search engine that plants trees
        driver = close_poped(driver)

        #https://www.ecosia.org/?c=en
        #10 pages
        for web in webs['generic']:

            driver.execute_script("window.open('');")
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)

            if isGrant:
                driver.get(web)
                #grant
                pyautogui.click(x=1170,y=110, clicks=1)
                time.sleep(1)
                pyautogui.click(x=1050,y=270)
                pyautogui.click(x=1120,y=150)

                driver.delete_all_cookies()
                driver.execute_script('localStorage.clear();')
                driver.execute_script('caches.delete();')
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')

    elif eid == 'gfkpklgmocbcbdabfellcnikamdaeajd':
        # SimplyCodes | Coupons that work.
        # coupon
        driver = close_poped(driver)

        for web in webs['shoppingjp']:

            driver.execute_script("window.open('');")
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')

    elif eid == 'bboamecjefgpaemgfpcjeediamdnkklc':
        # Ultimate Video Translator
        for web in webs['video_youtube']:

            driver.execute_script("window.open('');")
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)

            if isGrant:
                driver.get(web)
                #grant
                pyautogui.click(x=1140,y=110, clicks=1)
                time.sleep(1)
                pyautogui.click(x=1050,y=270)
                pyautogui.click(x=1200,y=150)

                driver.delete_all_cookies()
                driver.execute_script('localStorage.clear();')
                driver.execute_script('caches.delete();')
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full_video')

    elif eid == 'kimjfkgkpmafgngclkdpjdlkdlghoikh':
        # NFL Live Scores
        for web in webs['generic'] if inactive else webs['espn']:

            driver.execute_script("window.open('');")
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')

    # None (-1)
    elif eid == 'gfbepnlhpkbgbkcebjnfhgjckibfdfkc':
        # FantasyPros: Win your Fantasy League
        
        driver = close_poped(driver)

        if isLogin:
            driver.get('https://www.espn.com/nba/player/_/id/2991230/fred-vanvleet')
            time.sleep(1)
            pyautogui.click(x=1170,y=110)
            time.sleep(1)
            pyautogui.click(x=1050,y=270)
            time.sleep(1)
            pyautogui.click(x=1130,y=755)
            time.sleep(1)
            driver.delete_all_cookies()
            driver.execute_script('localStorage.clear();')
            driver.execute_script('caches.delete();')
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)

            pyautogui.click(x=510,y=540)
            pyautogui.write('account')  
            pyautogui.click(x=510,y=590)
            pyautogui.write('password')  
            pyautogui.click(x=510,y=666)
            time.sleep(2)
            pyautogui.click(x=190,y=110)
            time.sleep(1)
            pyautogui.click(x=1170,y=110)
            time.sleep(1)
            pyautogui.click(x=1050,y=270)
            time.sleep(1)

            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            driver.delete_all_cookies()
            driver.execute_script('localStorage.clear();')
            driver.execute_script('caches.delete();')         


        for web in webs['espn']:

            driver.execute_script("window.open('');")
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)

            measure(driver,eid,web,isLogin,isGrant,inactive,'full')

    elif eid == 'fdpohaocaechififmbbbbbknoalclacl':
        # GoFullPage
        driver.execute_script("window.open('');")
        time.sleep(2)
        driver.close()
        window_before = driver.window_handles[-1]
        driver.switch_to.window(window_before) 
        time.sleep(2)
        driver.delete_all_cookies()
        driver.execute_script('localStorage.clear();')
        driver.execute_script('caches.delete();')
        driver.close()
        window_before = driver.window_handles[0]
        driver.switch_to.window(window_before)

        for web in webs['generic']:

            driver.execute_script("window.open('');")
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)

            if isGrant:
                driver.get(web)
                #grant
                pyautogui.click(x=1170,y=110)
                time.sleep(1)
                pyautogui.click(x=1050,y=270)
                while len(driver.window_handles)<2:
                    True

                driver.delete_all_cookies()
                driver.execute_script('localStorage.clear();')
                driver.execute_script('caches.delete();')


                window_before = driver.window_handles[-1]
                driver.switch_to.window(window_before)
                # print(driver.title)
                driver.delete_all_cookies()
                driver.execute_script('localStorage.clear();')
                driver.execute_script('caches.delete();')
                driver.close()
                
                window_before = driver.window_handles[0]
                driver.switch_to.window(window_before)

            measure(driver,eid,web,isLogin,isGrant,inactive,'full')

    elif eid == 'ogdlpmhglpejoiomcodnpjnfgcpmgale':
        # Custom Cursor for Chrome
        driver = close_poped(driver)

        for web in webs['generic']:

            driver.execute_script("window.open('');")
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)

            measure(driver,eid,web,isLogin,isGrant,inactive,'full')

    elif eid == 'pcpjpdomcbnlkbghmchnjgeejpdlonli':
        # InteractiveFics
        for web in webs['generic']:

            driver.execute_script("window.open('');")
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)

            measure(driver,eid,web,isLogin,isGrant,inactive,'full')
    
    elif eid == 'eimadpbcbfnmbkopoojfekhnkhdbieeh':
        # Dark Reader
        driver = close_poped(driver)

        for web in webs['generic']:

            driver.execute_script("window.open('');")
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)

            measure(driver,eid,web,isLogin,isGrant,inactive,'full')
    
    elif eid == 'cnpniohnfphhjihaiiggeabnkjhpaldj':
        # Image Downloader
        driver = close_poped(driver)

        for web in webs['generic']:

            driver.execute_script("window.open('');")
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)

            measure(driver,eid,web,isLogin,isGrant,inactive,'full')
    
    elif eid == 'cmedhionkhpnakcndndgjdbohmhepckk':
        # Adblock for Youtube
        driver = close_poped(driver)

        for web in webs['video_youtube']:

            driver.execute_script("window.open('');")
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)

            measure(driver,eid,web,isLogin,isGrant,inactive,'full_video')
    
    elif eid == 'fbgcedjacmlbgleddnoacbnijgmiolem':
        # Microsoft Bing Search with Rewards
        driver = close_poped(driver)

        if isLogin:
            pyautogui.click(x=1170,y=110)
            time.sleep(1)
            pyautogui.click(x=1050,y=270)
            time.sleep(1)
            pyautogui.click(x=990,y=620)
            time.sleep(1)
            pyautogui.write('accountName')  
            time.sleep(1)
            pyautogui.press(['enter'])
            pyautogui.write('password##')
            time.sleep(1)
            pyautogui.press(['enter'])
            time.sleep(4)
            pyautogui.press(['enter'])
            time.sleep(2)
            window_before = driver.window_handles[1]
            driver.switch_to.window(window_before)
            # driver.delete_all_cookies()
            driver.execute_script('localStorage.clear();')
            driver.execute_script('caches.delete();') 
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)

        for web in webs['generic']:
            driver.execute_script("window.open('');")
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)

            measure(driver,eid,web,isLogin,isGrant,inactive,'full')


    elif eid == 'mefgmmbdailogpfhfblcnnjfmnpnmdfa':
        # Feedbro

        for web in webs['lichess']:
            driver.execute_script("window.open('');")
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)

            measure(driver,eid,web,isLogin,isGrant,inactive,'full')

    elif eid == 'ammjkodgmmoknidbanneddgankgfejfh':
        # 7TV
        
        if isGrant:
            time.sleep(2)
            window_before = driver.window_handles[1]
            driver.switch_to.window(window_before)
            print(driver.title)
            WebDriverWait(driver, 3).until(EC.presence_of_element_located((By.XPATH, '//span[text()="Platforms"]'))).click()
            
            time.sleep(1)
            if len(driver.find_elements("xpath",'//div[contains(@selected,"true")]')) == 1:
                pyautogui.click(x=800,y=710)
            pyautogui.click(x=1020,y=1515)
            pyautogui.click(x=870,y=285)
            time.sleep(2)
            pyautogui.click(x=1020,y=1515)
            pyautogui.click(x=1020,y=1515)
            pyautogui.click(x=1020,y=1515)
            pyautogui.click(x=1020,y=1515)

            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
        else:
            driver = close_poped(driver)

        for web in webs['video_youtube']:
            driver.execute_script("window.open('');")
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)

            measure(driver,eid,web,isLogin,isGrant,inactive,'full_video')

    
    elif eid == 'felcpnemckonbbmnoakbjgjkgokkbaeo':
        # Trusted Shops extension for Google Chrome

        for web in webs['shoppingjp']:
            driver.execute_script("window.open('');")
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)

            measure(driver,eid,web,isLogin,isGrant,inactive,'full')
    
    # reference 
    elif eid == 'pgniedifoejifjkndekolimjeclnokkb': # 0
        # Global Twitch Emotes
        # 10 from Twitch.tv
        for web in webs['video_twitch']:

            driver.execute_script("window.open('');")
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full_video')
    elif eid == 'jiiidpmjdakhbgkbdchmhmnfbdebfnhp': # 2
        # Designer Tools
        for web in webs['generic']:

            driver.execute_script("window.open('');")
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')
    elif eid == 'behkgahlidmeemjefcbgieigiejiglpc':
        # Better Tab: Speed Dial, News Feed & To-do
        for web in webs['generic']:

            driver.execute_script("window.open('');")
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')
    elif eid == 'bhggankplfegmjjngfmhfajedmiikolo': # 4
        # Send to Google Maps
        for web in webs['generic']:

            driver.execute_script("window.open('');")
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')

    elif eid == 'ldjnabbinoccbodkejkdiolmadimbjkj':
        # JobsAlert.pk
        for web in webs['jobsalert']:

            driver.execute_script("window.open('');")
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')

    elif eid == 'obhadkdgdffnnbdfpigjklinjhbkinfh':
        # ShadowPay Trademanager
        if isLogin:
            driver.get(f'https://shadowpay.com/en')
            time.sleep(2)
            
            pyautogui.click(x=1180,y=225)
            time.sleep(2)
            window_before = driver.window_handles[1]
            driver.switch_to.window(window_before)

            WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.XPATH, '//form/input[@name="username"]'))).send_keys('xxxxxxxx')
            WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.XPATH, '//form/input[@name="password"]'))).send_keys('xxxxxxxx')
            WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.XPATH, '//form/div/input[@value="Sign In"]'))).click()
            time.sleep(8)

            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)

            # driver.delete_all_cookies()
            driver.execute_script('localStorage.clear();')
            driver.execute_script('caches.delete();')

        if isGrant:
            pyautogui.click(x=1170,y=110, clicks=1)
            time.sleep(1)
            pyautogui.click(x=1050,y=270)
            time.sleep(4)
            pyautogui.click(x=1200,y=150)

        for web in webs['generic'] if inactive else webs['shadowpay']:
            driver.execute_script("window.open('');")
            driver.close()
            window_before = driver.window_handles[0]
            driver.switch_to.window(window_before)
            
            measure(driver,eid,web,isLogin,isGrant,inactive,'full')
   
    driver.close()
    driver.quit()
    time.sleep(60)


def free_set():
    done =[]
    data = np.loadtxt('free.txt', dtype=str)
    for i in range(int(len(data)/7)):
        if data[7 * i] not in done:
                done.append(data[7 * i])

    for name in webs:
        if name not in done:
            print(name)

            driver=open_driver('','free')
            for web in webs[name]:
                driver.execute_script("window.open('');")
                driver.close()
                window_before = driver.window_handles[0]
                driver.switch_to.window(window_before)
                
                measure(driver,name,web,0,0,0,f'free_{name}')
            driver.close()
            driver.quit()
            time.sleep(60)



if os.path.isfile('free.txt'):
    os.system('echo -n > free.txt')
else:
    os.system('touch free.txt')

if os.path.isfile('notGrant.txt'):
    os.system('echo -n > notGrant.txt')
else:
    os.system('touch notGrant.txt')

if os.path.isfile('notLogin.txt'):
    os.system('echo -n > notLogin.txt')
else:
    os.system('touch notLogin.txt')

if os.path.isfile('full.txt'):
    os.system('echo -n > full.txt')
else:
    os.system('touch full.txt')


os.system('echo password\\\n | sudo -S chown :username /sys/class/powercap/intel-rapl/intel-rapl:0/intel-rapl:0:0/energy_uj')
os.system('sudo chmod 040 /sys/class/powercap/intel-rapl/intel-rapl:0/intel-rapl:0:0/energy_uj')
os.system('sudo chown :username /sys/class/powercap/intel-rapl/intel-rapl:0/intel-rapl:0:1/energy_uj')
os.system('sudo chmod 040 /sys/class/powercap/intel-rapl/intel-rapl:0/intel-rapl:0:1/energy_uj')

###
webs ={
'generic': ['https://www.google.com','https://www.youtube.com','https://www.bing.com',
'https://www.amazon.ca','https://www.apple.com','https://www.reddit.com','https://www.paypal.com',
'https://www.yahoo.com','https://www.wikipedia.org','https://www.fandom.com'],

'news' :['https://n.news.naver.com/mnews/article/008/0004801507?sid=102','https://n.news.naver.com/mnews/article/025/0003228132?sid=100','https://n.news.naver.com/mnews/article/011/0004105653?sid=101',
'https://n.news.naver.com/mnews/article/018/0005332393?sid=110', 'https://n.news.naver.com/mnews/article/028/0002608671?sid=102',
'https://v.daum.net/v/20221004020042949','https://v.daum.net/v/20221004050035781','https://v.daum.net/v/20221004064208804',
'https://v.daum.net/v/20221004062508666','https://v.daum.net/v/20221004015347941'],

# best sellers
'shoppingjp' : ['https://www.amazon.co.jp/dp/B003P18FB2','https://www.amazon.co.jp/dp/B079Z4HDS5','https://www.amazon.co.jp/dp/B083SP2KX8',
'https://www.amazon.co.jp/dp/B002Y06MOC','https://www.amazon.co.jp/dp/B001D2BI4G','https://www.amazon.co.jp/dp/B0BGN9VN37'
,'https://www.amazon.co.jp/dp/B0BGNCF723','https://www.amazon.co.jp/dp/B0BGNBQ6R2','https://www.amazon.co.jp/dp/B0BGN89WKV',
'https://www.amazon.co.jp/dp/B07XDDVNZY'],

# all 720p, ~10 mins
'video_youtube' :['https://www.youtube.com/watch?v=Q-vuR4PJh2c','https://www.youtube.com/watch?v=jWyUFyo9JbQ','https://www.youtube.com/watch?v=1m58aE92StY',
'https://www.youtube.com/watch?v=9GUeGJNIYSE','https://www.youtube.com/watch?v=Pz5z_aXKQvI','https://www.youtube.com/watch?v=V5GTOWDlfWo',
'https://www.youtube.com/watch?v=zz440EuFK8Q','https://www.youtube.com/watch?v=8BVCILoSgiI','https://www.youtube.com/watch?v=MRkz68G674o',
'https://www.youtube.com/watch?v=wNaiEqA3yvs'],

'video_twitch':['https://www.twitch.tv/videos/1605610755','https://www.twitch.tv/videos/1605626317','https://www.twitch.tv/videos/1606591269',
'https://www.twitch.tv/videos/1605610194','https://www.twitch.tv/videos/1604700376','https://www.twitch.tv/videos/1606597446',
'https://www.twitch.tv/videos/1606592837','https://www.twitch.tv/videos/1607580104','https://www.twitch.tv/videos/1608323380','https://www.twitch.tv/videos/1605618002'],

'espn' :['https://www.espn.com/nba/player/_/id/2991230/fred-vanvleet','https://www.espn.com/nba/player/_/id/3948153/chris-boucher','https://www.espn.com/nba/player/_/id/3149673/pascal-siakam',
'https://www.espn.com/nba/player/_/id/4277843/gary-trent-jr','https://www.espn.com/nba/player/_/id/3978/demar-derozan','https://www.espn.com/nba/player/_/id/4066421/lonzo-ball',
'https://www.espn.com/nba/player/_/id/3064440/zach-lavine','https://www.espn.com/nba/player/_/id/6478/nikola-vucevic','https://www.espn.com/nba/player/_/id/3468/russell-westbrook',
'https://www.espn.com/nba/player/_/id/1966/lebron-james'],

#https://gitstar-ranking.com/repositories # same level 1 layer, must be project not note, same code amount ~20 lines
'github' : ['https://github.com/freeCodeCamp/freeCodeCamp/blob/main/api-server/ecosystem.config.js','https://github.com/kamranahmedse/developer-roadmap/blob/master/components/links-list.tsx',
'https://github.com/vuejs/vue/blob/main/types/common.d.ts','https://github.com/facebook/react/blob/main/.codesandbox/ci.json','https://github.com/tensorflow/tensorflow/blob/master/third_party/astunparse.BUILD',
'https://github.com/twbs/bootstrap/blob/main/build/postcss.config.js','https://github.com/ohmyzsh/ohmyzsh/blob/master/themes/apple.zsh-theme','https://github.com/TheAlgorithms/Python/blob/master/web_programming/covid_stats_via_xpath.py',
'https://github.com/flutter/flutter/blob/master/.github/move.yml','https://github.com/torvalds/linux/blob/master/scripts/Makefile.randstruct'],

'draftkings' :['https://sportsbook.draftkings.com/leagues/soccer/costa-rica---primera-div', 'https://sportsbook.draftkings.com/leagues/soccer/copa-sudamericana',
'https://sportsbook.draftkings.com/leagues/soccer/copa-libertadores','https://sportsbook.draftkings.com/leagues/soccer/chinese---1st-div',
'https://sportsbook.draftkings.com/leagues/soccer/chile---primera-league','https://sportsbook.draftkings.com/leagues/soccer/chile-cup',
'https://sportsbook.draftkings.com/leagues/soccer/champions-league','https://sportsbook.draftkings.com/leagues/soccer/bulgaria---first-league',
'https://sportsbook.draftkings.com/leagues/soccer/brazil---serie-a','https://sportsbook.draftkings.com/leagues/soccer/spain---la-liga'],

'apk':[ 'https://www.apkforpcwindows.download/2019/12/kinemaster-for-pc-windows.html','https://www.apkforpcwindows.download/2019/12/quik-video-editor-for-pc.html',
'https://www.apkforpcwindows.download/2019/12/viva-video-for-pc-windows.html','https://www.apkforpcwindows.download/2021/04/snaptube-for-pc.html',
'https://www.apkforpcwindows.download/2021/04/tubemate-for-pc-download.html','https://www.apkforpcwindows.download/2021/05/meme-marketing-right-and-wrong-way.html',
'https://www.apkforpcwindows.download/2021/04/moj-app-for-pc.html','https://www.apkforpcwindows.download/2021/04/josh-short-video-app-for-pc.html',
'https://www.apkforpcwindows.download/2020/01/tik-tok-for-pc-free-download.html','https://www.apkforpcwindows.download/2019/12/viva-video-for-pc-windows.html'],

'oktool':['https://oktools.ru/nebolshie-problemy-v-google-chrome.html','https://oktools.ru/oktools-4-3-obnovlenie-dlya-chrome-i-mozilla.html',
'https://oktools.ru/sozdat-temu-v-odnoklassnikah.html','https://oktools.ru/oktools-perestal-rabotat-chto-delat.html',
'https://oktools.ru/stikery-dlya-odnoklassnikov.html','https://oktools.ru/odnoklassniki-moya-stranica-bystryy-v.html',
'https://oktools.ru/tekhnicheskaya-podderzhka.html','https://oktools.ru/novaya-versiya-oktools-3-5.html',
'https://oktools.ru/versiya-2-6-5-dostupna-dlya-google-chrome.html','https://oktools.ru/obnovlenie-4-1-2-sozdat-temu-v-odnoklass.html'],

'tricky':['https://www.trickyenough.com/most-common-digital-nomad-mistakes-to-avoid/','https://www.trickyenough.com/who-viewed-my-instagram-profile/',
'https://www.trickyenough.com/best-kodi-add-ons-and-apps-for-a-jailbroken-firestick/','https://www.trickyenough.com/start-a-successful-online-wholesale-clothing-business-in-7-steps/',
'https://www.trickyenough.com/the-importance-of-business-plans-for-entrepreneurs/','https://www.trickyenough.com/know-all-about-cybersecurity-and-its-importance-here/',
'https://www.trickyenough.com/difference-between-web-hosting-and-cloud-hosting/','https://www.trickyenough.com/tools-to-view-private-instagram-profile/',
'https://www.trickyenough.com/instagram-story-maker-templates/','https://www.trickyenough.com/move-forward-in-math-with-the-help-of-online-math-tutors/'],

'ereality':['https://news.ereality.ru/index.php?newsid=5460','https://news.ereality.ru/index.php?newsid=5461','https://news.ereality.ru/index.php?newsid=5462','https://news.ereality.ru/index.php?newsid=5463',
'https://news.ereality.ru/index.php?newsid=5464','https://news.ereality.ru/index.php?newsid=5465','https://news.ereality.ru/index.php?newsid=5466','https://news.ereality.ru/index.php?newsid=5467',
'https://news.ereality.ru/index.php?newsid=5468','https://news.ereality.ru/index.php?newsid=5469'],

'lichess':['https://lichess.org/forum/general-chess-discussion/modern-vs-kid','https://lichess.org/forum/general-chess-discussion/who-thinks-niemann-cheated-vs-magnus',
'https://lichess.org/forum/general-chess-discussion/large-analysis-of-niemanns-games-proves-cheating-unlikely','https://lichess.org/forum/general-chess-discussion/is-there-a-way-to-prevent-someone-from-spectating-your-games',
'https://lichess.org/forum/general-chess-discussion/is-president-joe-biden-able-to-beat-magnus-carlsen-at-chess','https://lichess.org/forum/general-chess-discussion/reading-material-indication',
'https://lichess.org/forum/general-chess-discussion/not-improving-by-playing-puzzles-','https://lichess.org/forum/general-chess-discussion/what-skills-do-bullet-games-improve-in-a-player',
'https://lichess.org/forum/general-chess-discussion/niemann-sus-rating-change','https://lichess.org/forum/general-chess-discussion/i-am-currently-1900-and-i-really-wanna-get-to-2100-2300-level-rating-what-can-i-do'],

'jobsalert': ['https://jobsalert.pk/tag/professor','https://jobsalert.pk/tag/consultant','https://jobsalert.pk/tag/cook','https://jobsalert.pk/tag/ceo',
'https://jobsalert.pk/tag/chef','https://jobsalert.pk/tag/cfo','https://jobsalert.pk/tag/driver','https://jobsalert.pk/tag/doctor',
'https://jobsalert.pk/tag/designer','https://jobsalert.pk/tag/educator'],

'shadowpay': ['https://shadowpay.com/en/item/26654266-17774','https://shadowpay.com/en/item/27340295-17695','https://shadowpay.com/en/item/27348880-17816',
'https://shadowpay.com/en/item/27804041-17882','https://shadowpay.com/en/item/26356160-17645','https://shadowpay.com/en/item/27398025-17691',
'https://shadowpay.com/en/item/27779128-17860','https://shadowpay.com/en/item/27324621-17773','https://shadowpay.com/en/item/27036972-17818', 
'https://shadowpay.com/en/item/27813445-17718']
}


pyautogui.PAUSE = 1

# grant needed
grant =['ffnhmkgpdmkajhomnckhabkfeakhcamm', 'fmidkjgknpkbmninbmklhcgaalfalbdh','kfimphpokifbjgmjflanmfeppcjimgah', 
'lcpkicdemehhmkjolekhlglljnkggfcf', 'fhjanlpjlfhhbhbnjohflphmfccbhmoi','naankklphfojljboaokgfbheobbgenka', 
'mlfkmhibffpoleieiomjkekmjipdekhg','bboamecjefgpaemgfpcjeediamdnkklc', 'eedlgdlajadkbbjoobobefphmfkcchfk', 
'iedjpcecgmldlnkbojiocmdaedhepbpn', 'fdpohaocaechififmbbbbbknoalclacl', 'ammjkodgmmoknidbanneddgankgfejfh',
'behkgahlidmeemjefcbgieigiejiglpc']

# login needed
login = ['ffnhmkgpdmkajhomnckhabkfeakhcamm','cimpffimgeipdhnhjohpbehjkcdpjolg','gmopgnhbhiniibbiilmbjilcmgaocokj',
         'ikdgincnppajmpmnhfheflannaiapmlm','kfimphpokifbjgmjflanmfeppcjimgah','nngceckbapebfimnlniiiahkandclblb',
         'fhjanlpjlfhhbhbnjohflphmfccbhmoi','lokmacldfjfgajcebibmmfohacnikhhd', 'dapjbgnjinbpoindlpdmhochffioedbn',
         'mmeijimgabbpbgpdklnllpncmdofkcpn', 'mlfkmhibffpoleieiomjkekmjipdekhg', 'didkfdopbffjkpolefhpcjkohcpalicd',
         'pbjikboenpfhbbejgkoklgkhjpfogcam', 'nkbihfbeogaeaoehlefnkodbefgpgknn', 'fbgcedjacmlbgleddnoacbnijgmiolem',
         'gfbepnlhpkbgbkcebjnfhgjckibfdfkc','obhadkdgdffnnbdfpigjklinjhbkinfh']



# and other not active to thier target eg weather those need reference 6
active_NG = ['kpghljlpdknmomchobaoecdlkcpocaga', 'bkkjeefjfjcfdfifddmkdmcpmaakmelp', 'gmopgnhbhiniibbiilmbjilcmgaocokj',
'neebplgakaahbhdphmkckjjcegoiijjo', 'fadndhdgpmmaapbmfcknlfgcflmmmieb', 'pkihbahhbihfoebgdfkibnblbhjfgefc',
'jicldjademmddamblmdllfneeaeeclik', 'fnhmjceoafkkibpijbfpfajbhkknadmb', 'mhkhmbddkmdggbhaaaodilponhnccicb',
'lipplpkgbnhdfdchoibgafjdblpjdkpi', 'kimjfkgkpmafgngclkdpjdlkdlghoikh', 'obhadkdgdffnnbdfpigjklinjhbkinfh']


###
time.sleep(60)

# extension-free mode
free_set()

print('fully loaded')
cnt = 0
for label in range(-1,5):
    for eid in [file for file in list(set(os.listdir(f'/xxxxxxxx/crx/{label}'))) if os.path.isfile(os.path.join(f'/xxxxxxxx/crx/{label}', file))]:
        eid = eid.split('.crx')[0]
        cnt+=1
        print(cnt, 72-cnt,'fully loaded')
        full_set(label, eid, 1, 1, 0) #,isLogin,isGrant,inactive

print('no grant')
cnt = 0
for label in range(-1,5):
    for eid in [file for file in list(set(os.listdir(f'/xxxxxxxx/crx/{label}'))) if os.path.isfile(os.path.join(f'/xxxxxxxx/crx/{label}', file))]:
        eid = eid.split('.crx')[0]
        if eid in grant:
            cnt+=1
            print(cnt, len(login)-cnt,'no grant')
            full_set(label, eid, 1, 0, 0) #,isLogin,isGrant,inactive

print('no login')
cnt = 0
for label in range(-1,5):
    for eid in [file for file in list(set(os.listdir(f'/xxxxxxxx/crx/{label}'))) if os.path.isfile(os.path.join(f'/xxxxxxxx/crx/{label}', file))]:
        eid = eid.split('.crx')[0]        
        if eid in login:
            cnt+=1
            print(cnt, len(login)-cnt,'no login')
            full_set(label, eid, 0, 1, 0) #,isLogin,isGrant,inactive

print('inactive/non-designated')
cnt = 0
for label in range(-1,5):
    for eid in [file for file in list(set(os.listdir(f'/xxxxxxxx/crx/{label}'))) if os.path.isfile(os.path.join(f'/xxxxxxxx/crx/{label}', file))]:
        eid = eid.split('.crx')[0]
        if eid in active_NG:
            cnt+=1
            print(cnt, len(login)-cnt,'non-designated')
            full_set(label, eid, 1, 1, 1) #,isLogin,isGrant,inactive

print('fully inactive')
cnt = 0
for label in range(-1,5):
    for eid in [file for file in list(set(os.listdir(f'/xxxxxxxx/crx/{label}'))) if os.path.isfile(os.path.join(f'/xxxxxxxx/crx/{label}', file))]:
        eid = eid.split('.crx')[0]
        if eid in active_NG:
            cnt+=1
            print(cnt, len(login)-cnt,'fully inactive')
            full_set(label, eid, 0, 0, 1) #,isLogin,isGrant,inactive
