library(Hmisc)
library(dplyr)
library(lattice)                 # Data visualization system
library(optimx)
library(forcats)

library(vegan)

ext <- ext <- readxl::read_xlsx("xxxxxx/metricExtend.xlsx")
encoded_category <- model.matrix(~category-1, data=ext)
ext <- cbind(ext,encoded_category)
ext <- data.matrix(ext)

ext <- transform(ext, size = (size))
ext <- transform(ext, users = (users))
ext <- transform(ext, rate = (rate))
ext <- transform(ext, rateCount = (rateCount))

ext$Size_.gif <- ext$Size_.gif + ext$Size_.GIF
ext$Size_.GIF <- NULL

f_all <- ext
f_all$testBase <- NULL
f_all$'financial.and.payment.information'<- NULL 
f_all$'health.information'<- NULL
f_all$cluster <- NULL
# f_all$size <- NULL
f_all$time <- NULL
f_all$loading <- NULL
f_all$static <- NULL

f_all <- select(f_all, -contains("Files_."))
f_all<- select(f_all, -contains("Number_."))
f_all<- select(f_all, -contains("category"))
f_all$category <- NULL


names(f_all)[names(f_all) == 'login'] <- 'isLogin'
names(f_all)[names(f_all) == 'grant'] <- 'isGrant'
names(f_all)[names(f_all) == 'inactive'] <- 'isInactive'
names(f_all)[names(f_all) == 'fullInactive'] <- 'isFullyInactive'

# Normalize
minMax <- function(x) {
  (x - min(x)) / (max(x) - min(x))
}
f_all <- as.data.frame(lapply(f_all, minMax))
# Select notna
f_all <- f_all %>% select_if(~ !any(is.na(.)))

# Remove duplication
f_all <- f_all[!duplicated(f_all), ]
f_all <- f_all[vapply(f_all, function(x) length(unique(x)) >= 1, logical(1L))]

# Match the variable names with the research metric names
metrics <- c(CountClassBase='IFANIN',CountClassDerived='NOC',CountClassCoupled='CBO',CountDeclClassVariable='NV',
             CountDeclInstanceMethod='NIM',CountDeclInstanceVariable='NIV',CountDeclMethod='WMC',CountDeclMethodAll='RFC',
             CountDeclMethodFriend='NFM',CountDeclMethodPrivate='NPRM',CountDeclMethodPublic='NPM',CountInput='FANIN',
             CountLine='NL',CountLineBlank='BLOC',CountLineCode='LOC',CountLineComment='CLOC',
             CountOutput='FANOUT',CountPath='NPATH',Cyclomatic='CC',CyclomaticModified='CC3',
             CyclomaticStrict='CC2',Essential='ev(G)',MaxInheritanceTree='DIT',PercentLackOfCohesion='LCOM',
             SumCyclomatic='WMC2')

f_new <- data.frame()
for (metr in names(metrics)){
  if(metr %in% colnames(f_all)){
    if(nrow(f_new)!=0){f_new <- cbind(f_all[metr],f_new)}
    else{f_new <- f_all[metr]}
  }
}
colnames(f_new) <- paste(colnames(f_new),metrics[colnames(f_new)],sep="-") 

f_new <- cbind(f_all[,49:ncol(f_all)],f_new)

library("ggpubr")
red <- redun(~.,data=f_new, r2=0.9,nk=0)
print(red)