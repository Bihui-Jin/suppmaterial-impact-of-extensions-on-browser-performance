import multiprocessing as mp
import datetime
from datetime import timedelta
import time
import os
import pandas as pd
import numpy as np
import sqlite3
import requests
from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service

# all xxxxx needs to be replaced to your own variables

def job_viewall(driver, x, db, ids):
    collection = []
    if x.split('-')[1] == "accessibility":
        driver.get('https://chrome.google.com/webstore/category/collection/3p_accessibility_extensions?hl=en-GB')
    else:
        link = ''
        if len(x.split('-')) > 2:
            link = x.split('-')[-2]+'-'+x.split('-')[-1]
        else:
            link = x.split('-')[-1]
        print(link)
        driver.get(f'https://chrome.google.com/webstore/category/collection/top_picks_{link}?hl=en-GB')
    
    WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.XPATH, '//a[@role="gridcell"]')))
    
    for e in driver.find_elements("xpath",'//a[@role="gridcell"]'):
        el = e.get_attribute('href')
        if el.split('/')[-1].split('?')[0].strip() not in ids:
            collection.append(el)
            
    for p in collection:
        if requests.get(p).status_code == 200:
            driver.get(p)
            try:
                WebDriverWait(driver, 25).until(EC.presence_of_element_located((By.XPATH, '//span[@itemprop="aggregateRating"]')))
            except:
                time.sleep(30)
                continue

            rv = float(driver.execute_script('var items = {}; for (index = 0; index < arguments[0].attributes.length; ++index) { items[arguments[0].attributes[index].name] = arguments[0].attributes[index].value }; return items;', driver.find_element("xpath",'//meta[@itemprop="ratingValue"]'))['content'])
            rc = int(driver.execute_script('var items = {}; for (index = 0; index < arguments[0].attributes.length; ++index) { items[arguments[0].attributes[index].name] = arguments[0].attributes[index].value }; return items;', driver.find_element("xpath",'//meta[@itemprop="ratingCount"]'))['content'])
            catelog = driver.find_element("xpath",'//a[contains(@aria-label,"Category:")]').get_attribute('textContent')
            name = driver.find_element("xpath",'//h1[@class="e-f-w"]').text.replace("'", "''")

            privacy = ''
            driver.find_element("xpath",'//div[contains(text(),"Privacy practices")]').find_element("xpath",'./..').click()

            if len(driver.find_elements("xpath",'//li//label[contains(@class,"RKs90c-fb-u-R")]')) > 0:
                for i in driver.find_elements("xpath",'//li//label[contains(@class,"RKs90c-fb-u-R")]'):
                    privacy += i.text+';'
            elif len(driver.find_elements("xpath",'//*[contains(text(),"The publisher has not provided any information about the collection or usage of your data")]')) > 0:
                privacy = 'not provided;'
            elif len(driver.find_elements("xpath",'//*[contains(text(),"The publisher has disclosed that it will not collect or use your data")]')) > 0:
                privacy = 'None;'
            else:
                privacy = 'others;'
            uid = p.split('/')[-1].split('?')[0]

            size = driver.find_element("xpath",'//span[contains(@class,"C-b-p-D-Xe h-C-b-p-D-za")]').get_attribute('textContent')

            capability = ''
            for f in driver.find_elements("xpath",'//div[contains(@class,"G-Pb")]'):
                capability += f.get_attribute('textContent') +';'

            if len(driver.find_elements("xpath",'//span[contains(@title," users")]')) >0:
                users = driver.find_element("xpath",'//span[contains(@title," users")]').get_attribute('title')
            else:
                print('NOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO user')
                users = 0


            try:
                print(f'{len(collection) - collection.index(p)}- '+catelog + ' '+name+' ratingValue:'+ str(rv)+' ratingCount:'+str(rc) +f' {users}')
                timestamp = (datetime.datetime.now() - datetime.datetime(1970, 1, 1)) / timedelta(seconds=1)
                db.execute(f"INSERT INTO extensions (id, name, category, rate, rateCount, users, privacy, capability, size, timestamp)" + 
                f" SELECT * FROM (SELECT '{uid}', '{name}', '{catelog}', {rv}, {rc}, '{users}', '{privacy[:-1]}', '{capability[:-1]}', '{size}', '{timestamp}') AS tmp" +
                f" WHERE NOT EXISTS (SELECT id FROM extensions WHERE id = '{uid}')" +
                " LIMIT 1;")
            except Exception as e:
                print(e)
                print(catelog + ' '+name+' ratingValue:'+ str(rv)+' ratingCount:'+str(rc) +f' {users}')
                time.sleep(1)
                timestamp = (datetime.datetime.now() - datetime.datetime(1970, 1, 1)) / timedelta(seconds=1)
                db.execute(f"INSERT INTO extensions (id, name, category, rate, rateCount, users, privacy, capability, size, timestamp)" + 
                f" SELECT * FROM (SELECT '{uid}', '{name}', '{catelog}', {rv}, {rc}, '{users}', '{privacy[:-1]}', '{capability[:-1]}', '{size}', '{timestamp}') AS tmp" +
                f" WHERE NOT EXISTS (SELECT id FROM extensions WHERE id = '{uid}')" +
                " LIMIT 1;")
    return driver



def job_recom(driver, x, db, conn, ids):
    collection2 = []
    driver.get(f'https://chrome.google.com/webstore/category/{x}?hl=en-GB')
    WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.XPATH, '//h2[text()="More recommendations"]')))
    totLen = 0
    TimeStart = datetime.datetime.now()
    while True:

        driver.execute_script("window.scrollTo(0, window.pageYOffset + window.innerHeight);")
        TimeEnd = datetime.datetime.now()
        
        
        if x.split('-')[1] == 'fun':
            if (TimeEnd - TimeStart).total_seconds() / 60 > 11.5 :
                totLen = len(driver.find_elements("xpath",'//div[@role="grid"]//a'))
                print(f'ext: {totLen}')
                break
        elif x.split('-')[1] == 'photos' or x.split('-')[1] == 'web':
            if (TimeEnd - TimeStart).total_seconds() / 60 > 4:
                totLen = len(driver.find_elements("xpath",'//div[@role="grid"]//a'))
                print(f'ext: {totLen}')
                break
        elif x.split('-')[1] == 'sports':
            if (TimeEnd - TimeStart).total_seconds() / 60 > 0.5:
                totLen = len(driver.find_elements("xpath",'//div[@role="grid"]//a'))
                print(f'ext: {totLen}')
                break
        else:
            if (TimeEnd - TimeStart).total_seconds() / 60 > 3:
                totLen = len(driver.find_elements("xpath",'//div[@role="grid"]//a'))
                print(f'ext: {totLen}')
                break
    
    
    for h in driver.find_elements("xpath",'//div[@role="grid"]//a'):
        el = h.get_attribute('href')
        # indx +=1
        if el.split('/')[-1].split('?')[0] not in ids:
            collection2.append(el)

    print(str(len(collection2)) + " plug-ins found in Top Picks")
    for e in collection2:
        if requests.get(e).status_code == 200:
            if collection2.index(e) % 3000 == 0 and collection2.index(e) > 20:
                driver.close()
                driver.quit()

                driver = webdriver.Chrome(service=s)

            driver.get(e)
            try:
                WebDriverWait(driver, 25).until(EC.presence_of_element_located((By.XPATH, '//span[@itemprop="aggregateRating"]')))
            except:
                time.sleep(30)
                continue
            rv = float(driver.execute_script('var items = {}; for (index = 0; index < arguments[0].attributes.length; ++index) { items[arguments[0].attributes[index].name] = arguments[0].attributes[index].value }; return items;', driver.find_element("xpath",'//meta[@itemprop="ratingValue"]'))['content'])
            rc = int(driver.execute_script('var items = {}; for (index = 0; index < arguments[0].attributes.length; ++index) { items[arguments[0].attributes[index].name] = arguments[0].attributes[index].value }; return items;', driver.find_element("xpath",'//meta[@itemprop="ratingCount"]'))['content'])
            catelog = driver.find_element("xpath",'//a[contains(@aria-label,"Category:")]').get_attribute('textContent')
            name = driver.find_element("xpath",'//h1[@class="e-f-w"]').text.replace("'", "''")

            privacy = ''
            driver.find_element("xpath",'//div[contains(text(),"Privacy practices")]').find_element("xpath",'./..').click()
            if len(driver.find_elements("xpath",'//li//label[contains(@class,"RKs90c-fb-u-R")]')) > 0:
                for i in driver.find_elements("xpath",'//li//label[contains(@class,"RKs90c-fb-u-R")]'):
                    privacy += i.text+';'
            elif len(driver.find_elements("xpath",'//*[contains(text(),"The publisher has not provided any information about the collection or usage of your data")]')) > 0:
                privacy = 'not provided;'
            elif len(driver.find_elements("xpath",'//*[contains(text(),"The publisher has disclosed that it will not collect or use your data")]')) > 0:
                privacy = 'None;'
            else:
                privacy = 'others;'    

            uid = e.split('/')[-1].split('?')[0]
            size = driver.find_element("xpath",'//span[contains(@class,"C-b-p-D-Xe h-C-b-p-D-za")]').get_attribute('textContent')

            capability = ''
            for f in driver.find_elements("xpath",'//div[contains(@class,"G-Pb")]'):
                capability += f.get_attribute('textContent') +';'

            if len(driver.find_elements("xpath",'//span[contains(@title," users")]')) >0:
                users = driver.find_element("xpath",'//span[contains(@title," users")]').get_attribute('title')
            else:
                print('NOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO user')
                users = 0        


            try:
                print(f'{len(collection2) - collection2.index(e)}- '+catelog + ' '+name+' ratingValue:'+ str(rv)+' ratingCount:'+str(rc) +f' {users}')
                timestamp = (datetime.datetime.now() - datetime.datetime(1970, 1, 1)) / timedelta(seconds=1)
                db.execute(f"INSERT INTO extensions (id, name, category, rate, rateCount, users, privacy, capability, size, timestamp)" + 
                f" SELECT * FROM (SELECT '{uid}', '{name}', '{catelog}', {rv}, {rc}, '{users}', '{privacy[:-1]}', '{capability[:-1]}', '{size}', '{timestamp}') AS tmp" +
                f" WHERE NOT EXISTS (SELECT id FROM extensions WHERE id = '{uid}')" +
                " LIMIT 1;")
            except Exception as e:
                print(e)
                print(catelog + ' '+name+' ratingValue:'+ str(rv)+' ratingCount:'+str(rc) +f' {users}')

                time.sleep(1)
                timestamp = (datetime.datetime.now() - datetime.datetime(1970, 1, 1)) / timedelta(seconds=1)
                db.execute(f"INSERT INTO extensions (id, name, category, rate, rateCount, users, privacy, capability, size, timestamp)" + 
                f" SELECT * FROM (SELECT '{uid}', '{name}', '{catelog}', {rv}, {rc}, '{users}', '{privacy[:-1]}', '{capability[:-1]}', '{size}', '{timestamp}') AS tmp" +
                f" WHERE NOT EXISTS (SELECT id FROM extensions WHERE id = '{uid}')" +
                " LIMIT 1;")

            if collection2.index(e)%1000 == 0:
                driver.delete_all_cookies()
                driver.execute_script('localStorage.clear();')
                driver.execute_script('caches.delete();')
                conn.commit()
    return driver

        
def produc(x, db, conn, ids):
    collection2 = []
    # indx = 0
    driver = webdriver.Chrome(service=s)
    driver.get(f'https://chrome.google.com/webstore/category/{x}?hl=en-GB')
    WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.XPATH, '//h2[text()="More recommendations"]')))
    totLen = 0
    TimeStart = datetime.datetime.now()
    while True:

        driver.execute_script("window.scrollTo(0, window.pageYOffset + window.innerHeight);")
        TimeEnd = datetime.datetime.now()

        if x.split('-')[1] == "productivity" :
            if (TimeEnd - TimeStart).total_seconds() / 60 > 27:
                totLen = len(driver.find_elements("xpath",'//div[@role="grid"]//a'))
                print(f'ext: {totLen}')
                break
    
    
    for h in driver.find_elements("xpath",'//div[@role="grid"]//a'):
        el = h.get_attribute('href')
        if el.split('/')[-1].split('?')[0] not in ids:
            collection2.append(el)

    print(str(len(collection2)) + " plug-ins found in Top Picks")
    for e in collection2:
        print(e)
        if requests.get(e).status_code == 200:
            if collection2.index(e) % 3000 == 0 and collection2.index(e) > 20:
                driver.close()
                driver.quit()

                driver = webdriver.Chrome(service=s)

            driver.get(e)
            try:
                WebDriverWait(driver, 25).until(EC.presence_of_element_located((By.XPATH, '//span[@itemprop="aggregateRating"]')))
            except:
                time.sleep(30)
                continue
            rv = float(driver.execute_script('var items = {}; for (index = 0; index < arguments[0].attributes.length; ++index) { items[arguments[0].attributes[index].name] = arguments[0].attributes[index].value }; return items;', driver.find_element("xpath",'//meta[@itemprop="ratingValue"]'))['content'])
            rc = int(driver.execute_script('var items = {}; for (index = 0; index < arguments[0].attributes.length; ++index) { items[arguments[0].attributes[index].name] = arguments[0].attributes[index].value }; return items;', driver.find_element("xpath",'//meta[@itemprop="ratingCount"]'))['content'])
            catelog = driver.find_element("xpath",'//a[contains(@aria-label,"Category:")]').get_attribute('textContent')
            name = driver.find_element("xpath",'//h1[@class="e-f-w"]').text.replace("'", "''")

            privacy = ''
            driver.find_element("xpath",'//div[contains(text(),"Privacy practices")]').find_element("xpath",'./..').click()
            if len(driver.find_elements("xpath",'//li//label[contains(@class,"RKs90c-fb-u-R")]')) > 0:
                for i in driver.find_elements("xpath",'//li//label[contains(@class,"RKs90c-fb-u-R")]'):
                    privacy += i.text+';'
            elif len(driver.find_elements("xpath",'//*[contains(text(),"The publisher has not provided any information about the collection or usage of your data")]')) > 0:
                privacy = 'not provided;'
            elif len(driver.find_elements("xpath",'//*[contains(text(),"The publisher has disclosed that it will not collect or use your data")]')) > 0:
                privacy = 'None;'
            else:
                privacy = 'others;'    

            uid = e.split('/')[-1].split('?')[0]
            size = driver.find_element("xpath",'//span[contains(@class,"C-b-p-D-Xe h-C-b-p-D-za")]').get_attribute('textContent')

            capability = ''
            for f in driver.find_elements("xpath",'//div[contains(@class,"G-Pb")]'):
                capability += f.get_attribute('textContent') +';'

            if len(driver.find_elements("xpath",'//span[contains(@title," users")]')) >0:
                users = driver.find_element("xpath",'//span[contains(@title," users")]').get_attribute('title')
            else:
                print('NOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO user')
                users = 0        


            try:
                print(f'{len(collection2) - collection2.index(e)}- '+catelog + ' '+name+' ratingValue:'+ str(rv)+' ratingCount:'+str(rc) +f' {users}')
                timestamp = (datetime.datetime.now() - datetime.datetime(1970, 1, 1)) / timedelta(seconds=1)
                db.execute(f"INSERT INTO extensions (id, name, category, rate, rateCount, users, privacy, capability, size, timestamp)" + 
                f" SELECT * FROM (SELECT '{uid}', '{name}', '{catelog}', {rv}, {rc}, '{users}', '{privacy[:-1]}', '{capability[:-1]}', '{size}', '{timestamp}') AS tmp" +
                f" WHERE NOT EXISTS (SELECT id FROM extensions WHERE id = '{uid}')" +
                " LIMIT 1;")
            except Exception as e:
                print(e)
                print(catelog + ' '+name+' ratingValue:'+ str(rv)+' ratingCount:'+str(rc) +f' {users}')

                time.sleep(1)
                timestamp = (datetime.datetime.now() - datetime.datetime(1970, 1, 1)) / timedelta(seconds=1)
                db.execute(f"INSERT INTO extensions (id, name, category, rate, rateCount, users, privacy, capability, size, timestamp)" + 
                f" SELECT * FROM (SELECT '{uid}', '{name}', '{catelog}', {rv}, {rc}, '{users}', '{privacy[:-1]}', '{capability[:-1]}', '{size}', '{timestamp}') AS tmp" +
                f" WHERE NOT EXISTS (SELECT id FROM extensions WHERE id = '{uid}')" +
                " LIMIT 1;")

            if collection2.index(e)%1000 == 0:
                driver.delete_all_cookies()
                driver.execute_script('localStorage.clear();')
                driver.execute_script('caches.delete();')
                conn.commit()
    return driver
        

s=Service('/xxxxx/chromedriver') 

driver = webdriver.Chrome(service=s)
driver.get("https://chrome.google.com/webstore/category/extensions?hl=en-GB")

classname = driver.find_element("xpath", '//span[text()="Recommended for you"]').get_attribute('class').strip()
catagory = driver.find_elements("xpath",f"//*[contains(@class, '{classname}')]")
conn = sqlite3.connect('/xxxxx/plugin.db')
cur = conn.cursor()
cur.execute(f"CREATE table IF NOT EXISTS extensions (id text primary key, name text, category text, rate double, rateCount integer, users text, privacy text, capability text, size text, timestamp text);")
allIds = pd.read_sql(f"SELECT id FROM extensions",con=conn)
cur.close()
conn.commit()

ids = allIds.set_index('id').T.to_dict()


extLink = []
for c in catagory:
    e = driver.execute_script('var items = {}; for (index = 0; index < arguments[0].attributes.length; ++index) { items[arguments[0].attributes[index].name] = arguments[0].attributes[index].value }; return items;', c)
    extLink.append([e[s] for s in e if "ext/" in e[s]])

driver.delete_all_cookies()
driver.execute_script('localStorage.clear();')
driver.execute_script('caches.delete();')
driver.close()
driver.quit()

for e in extLink:
    if len(e) > 0:
    
        print(e[0])
        conn = sqlite3.connect('/xxxxx/plugin.db')
        cur = conn.cursor()
        if e[0].split('-')[1]=='productivity':
            driver = produc(e[0], cur, conn, ids)
        else:
            driver = webdriver.Chrome(service=s)

            driver = job_viewall(driver,e[0],cur, ids)
            driver = job_recom(driver,e[0], cur, conn, ids)

            try:
                driver.close()
                driver.quit()
            except Exception as e:
                print(e)
                cur.close()
                conn.commit()
                driver.quit()
                continue
        
        cur.close()
        conn.commit()


