# Chrome Extension Data Processing - Supplemental Materials
Supplemental materials for paper "Impact of Extensions on Browser Performance: An Empirical Study on Google Chrome".

# Introduction
We organize the replication package into three file folders:
1. Experiment: this folder contains code for our main experiment (i.e., collecting extensions, selecting representative extensions, and measuring the extensions);

2. Analysis: this folder contains code for two parts:

	2.1 Browser Performance Evaluation: the statistical methods (i.e., the wilcoxon signed-rank test and the Cliff's Delta test) and the change ratio calculation;
	
	2.2 Elastic Net Regression Model: factor-selecting helper and model builder.
	
3. Results: this folder contains the extension information stored in database, the clustering result in an excel file, extension selection steps in an excel file, installation packages of extensions, raw measurement data, and saved linear mixed effects models for our paper;

Our code is based on the following packages and versions:
* Python: 3.10.6
* Selenium: 4.4.0
* pyautogui: 0.9.53
* Numpy: 1.23.2
* Pandas: 1.4.3
* Sqlite3: 2.6.0
* Kmedoids: 0.3.3
* cliffs_delta: 1.0.0
* Scipy: 1.9.3
* R: 4.2.2

# Experiment
This part contains code for our main experiment in collecting the extension information from the Chrome Web Store, selecting representative extensions, and measuring the performance changes of the representative extensions. All code could be found under the experiment folder.

1. Crawler script

	This script (``collect.py``) is an automated script used to collect information of all extensions in the Chrome Web Store.

2. Extension Selection

	This script (``selecting representative extensions.ipynb``) guides the process of selecting extensions step by step.

3. Measurement

	This script (``measure.py``) is used to monitor the changes of the browser performance in terms of the page load time, the page load energy consumption, and the stabilized energy consumption. Extensions without privacy practice specifications are in the folder ../Results/crx/-1. Extensions selected based on privacy practice clustering results are provided in the folders 0 to 5.

# Analysis
This part contains code and materials for processing the dataset. The materials are introduced in two parts: Performance Evaluation (for RQs 1 and 2) and Linear Mixed Effects Models (for RQ3). All code could be found under the preprocessing folder.

  ## Performance Evaluation
  This part contains code for processing the measured raw data (for RQ1 and RQ2). The script ``performance evaluation.ipynb`` guides to process the raw data step by step and exports the processed result as an excel that will be used for the Elastic Net Regression Model in RQ3. Specifically, this script consists of five parts:
  
    1. Normalization

    2. Statistical analysis
      
    3. Performance change ratio

    4. Standard errors and the smallest sample size needed for the experiment

    5. Extension popularity
    
  ## Elastic Net Regression Models
  This part contains the code for constructing the Elastic Net Regression model in RQ3. 
  
  Use ``1-redundancy.R`` to perform redundancy analysis for the factors. 

  After determining the non redundant variables from ``1-redundancy.R``, apply them into the models to test hyperparameters using ``2-models.R``. Run this script with the command - ``source("xxxxxx/2-models.R", echo=TRUE, max.deparse.length=300000)``
  
  Next, use ``helper.ipynb`` to filter out model names that models in different tuneLengths yield valid values and past the content back to 3-modelCompare.R
  
  Lastly, using ``3-modelCompare.R`` to determine the ``tuneLength`` from the models with the lowest RMSE. Use ``coef(model$finalModel, model$bestTune$lambda)`` to view model results.

# Results
This part contains the output data from our main experiments. All output files could be found under the results folder.
This folder contains: (1) the extension information stored in database, (2) the clustering result in an excel file, (3) extension selection steps in an excel file, (4) installation packages of extensions, (5) extracted installation packages of extensions, (6) Understand project,(7) Understand analysis results, (8) raw measurement data, (9) extension factors in an excel file, and (10) saved elastic net regression models for our paper;

1. Extension information

	The collected information of all extensions in the Chrome Web Store are presented in the forms of SQL and database, which can be found in ``extensions.sql`` and ``plugin.db``.

2. The result of clustering extensions

	The output file (``kmedoids.xlsx``) contains the clustering result by K-medoid clustering algorithm.

3. The details of manually selecting extensions

	The output file (``extension selection steps.xlsx``) contains the process of selecting representative extensions with reasons provided.

4. Installation packages of extensions

	All candidate extensions (representative + discarded) are presented in folder crx. The installation packages of extensions are named by the extension ids. The folder name under crx (e.g., 1 and 2) is related to the cluter. For example, the selected extensions that are clutered to cluster 1 can be found in crx -> 1. Extensions without adopting any privacy practice can be found in crx -> -1.

5. Extracted installation packages of extensions
   
   	All 72 selected extensions (.crx files) are extracted via online tool to get source code and are presented in folder objects.

6. Understand project
   
   	The project ``object.und`` created by SciTools Understand (a software analysis tool) includes 72 selected extensions.

7. Understand results
    
   	The output file (``object.csv``) contains the analysis result by Understand.
	
8. Raw data

	Our measurements to the browser performance can be found under the folder - raw performance data. ``Free.txt`` contains the measurements for the extension-free mode. The file ``full.txt`` contains the measurements for the fully loaded mode.

9. Extension factors

   	The output file ``metricExtend.xlsx`` contains all studied factors of representative extensions. The file is used in RQ3 to build Elastic Net Regression Models.
	
10. model results

	Our linear mixed effects models can be found in the folder - saved models. To load the model, ``robustlmm`` function in R is required. Run ``readRDS("page load time.rds")`` to load the model in local.

# Tables
## Table: The extension clusters.
<table style="border-collapse: collapse; border: medium; border-spacing: 0px;">
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-top-width: 1px; border-top-style: solid; border-top-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Cluster
		</td>
		<td style="border-top-width: 1px; border-top-style: solid; border-top-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Privacy Practice
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-top-width: 1px; border-top-style: solid; border-top-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Number
		</td>
		<td style="border-top-width: 1px; border-top-style: solid; border-top-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Total
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			0
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; padding-right: 3pt; padding-left: 3pt;">
			None
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			31908
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			31908
		</td>
	</tr>
	<tr>
		<td rowspan="22" style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Website content
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			3412
		</td>
		<td rowspan="22" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			4056
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Website content, Authentication information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			213
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Website content, Web history
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			206
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, Website content
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			88
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Website content, Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			42
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, Website content, Web history
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			36
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, Website content, Authentication information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			10
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Website content, Authentication information, Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			10
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Website content, Web history, Authentication information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			10
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Website content, Web history, Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			6
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, Website content, Web history, Authentication information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			4
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Website content, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			4
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, Website content, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, Website content, Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Website content, Authentication information, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Website content, Web history, Authentication information, Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Website content, Web history, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, Website content, Authentication information, Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, Website content, Web history, Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Website content, Health information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Website content, Web history, Authentication information, Health information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; padding-right: 3pt; padding-left: 3pt;">
			Website content, Web history, Personal communications, Health information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
	</tr>
	<tr>
		<td rowspan="61" style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Authentication information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			492
		</td>
		<td rowspan="31" style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1951
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			P.I.I. (Personally identifiable information), Authentication information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			432
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Website content, P.I.I., Authentication information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			301
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, P.I.I., Authentication information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			79
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			P.I.I., Authentication information, Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			57
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, P.I.I., Authentication information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			54
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			P.I.I., Authentication information, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			54
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Authentication information, Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			32
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Web history, P.I.I., Authentication information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			31
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Website content, P.I.I., Authentication information, Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			31
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, Authentication information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			26
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, Website content, P.I.I., Authentication information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			25
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, P.I.I., Authentication information, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			23
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, P.I.I., Authentication information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			22
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Website content, P.I.I., Authentication information, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			22
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Website content, Web history, P.I.I., Authentication information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			20
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, P.I.I., Authentication information, Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			17
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, Web history, P.I.I., Authentication information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			17
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, P.I.I., Authentication information, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			16
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			P.I.I., Authentication information, Personal communications, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			16
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, P.I.I., Authentication information, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			16
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, Website content, Web history, P.I.I., Authentication information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			15
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Web history, Authentication information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			15
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Authentication information, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			13
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, P.I.I., Authentication information, Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			12
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Website content, Web history, P.I.I., Authentication information, Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			10
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, Website content, P.I.I., Authentication information, Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			7
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Website content, P.I.I., Authentication information, Personal communications, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			7
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, P.I.I., Authentication information, Personal communications, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			6
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, Web history, P.I.I., Authentication information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			6
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, Web history, P.I.I., Authentication information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			6
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, P.I.I., Authentication information, Personal communications, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			5
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Web history, P.I.I., Authentication information, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			5
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Website content, Web history, P.I.I., Authentication information, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			5
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Authentication information, Personal communications, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			4
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, P.I.I., Authentication information, Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			4
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, Web history, Authentication information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			4
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, Web history, P.I.I., Authentication information, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			4
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, Website content, P.I.I., Authentication information, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			4
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, P.I.I., Authentication information, Financial and payment information, Health information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			3
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, Web history, P.I.I., Authentication information, Personal communications, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			3
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, Web history, P.I.I., Authentication information, Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			3
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, Authentication information, Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, Web history, P.I.I., Authentication information, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, Website content, P.I.I., Authentication information, Personal communications, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			P.I.I., Authentication information, Health information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			P.I.I., Authentication information, Personal communications, Health information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Web history, Authentication information, Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Web history, P.I.I., Authentication information, Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Website content, Web history, P.I.I., Authentication information, Personal communications, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, Authentication information, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, P.I.I., Authentication information, Health information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, P.I.I., Authentication information, Personal communications, Health information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, Web history, P.I.I., Authentication information, Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, Website content, Web history, P.I.I., Authentication information, Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, Website content, Web history, P.I.I., Authentication information, Personal communications, Financial and payment information, Health information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			P.I.I., Authentication information, Personal communications, Financial and payment information, Health information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, P.I.I., Authentication information, Health information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, P.I.I., Authentication information, Personal communications, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, Web history, P.I.I., Authentication information, Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; padding-right: 3pt; padding-left: 3pt;">
			Website content, P.I.I., Authentication information, Health information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
	</tr>
	<tr>
		<td rowspan="59" style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			3
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			P.I.I.
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1490
		</td>
		<td rowspan="59" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			3649
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Website content, P.I.I.
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			449
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Web history
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			368
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			338
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, P.I.I.
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			121
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			116
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			P.I.I., Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			107
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, P.I.I.
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			85
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Web history, P.I.I.
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			83
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, Web history
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			53
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Website content, P.I.I., Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			52
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Website content, Web history, P.I.I.
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			46
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, Website content, P.I.I.
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			36
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			P.I.I., Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			34
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, P.I.I.
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			31
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, Web history, P.I.I.
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			23
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			21
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, Web history, P.I.I.
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			20
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, Website content, Web history, P.I.I.
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			15
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Website content, P.I.I., Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			15
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			12
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, P.I.I., Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			12
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, Web history, P.I.I.
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			12
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, Website content, P.I.I., Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			12
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, P.I.I., Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			11
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Health information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			8
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, P.I.I., Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			8
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, P.I.I., Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			7
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			P.I.I., Personal communications, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			6
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, P.I.I., Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			5
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			P.I.I., Health information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			4
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Website content, Web history, P.I.I., Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			4
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, P.I.I., Personal communications, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			3
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, Web history, P.I.I., Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			3
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, Web history, P.I.I., Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			3
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Web history, Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			3
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, P.I.I., Personal communications, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, Web history, P.I.I., Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, Website content, P.I.I., Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, Website content, P.I.I., Personal communications, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, Website content, Web history, P.I.I., Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, P.I.I., Personal communications, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Web history, P.I.I., Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Website content, P.I.I., Health information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Website content, P.I.I., Personal communications, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Website content, Web history, P.I.I., Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, P.I.I., Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, P.I.I., Health information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, Web history, P.I.I., Personal communications, Health information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, Web history, Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, Web history, P.I.I., Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, Website content, Web history, P.I.I., Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			P.I.I., Financial and payment information, Health information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			P.I.I., Personal communications, Health information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, Web history, P.I.I., Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Web history, P.I.I., Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Web history, P.I.I., Personal communications, Health information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Website content, Web history, P.I.I., Personal communications, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; padding-right: 3pt; padding-left: 3pt;">
			Website content, Web history, P.I.I., Personal communications, Health information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
	</tr>
	<tr>
		<td rowspan="63" style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			4
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, Website content
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			513
		</td>
		<td rowspan="63" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1586
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, Website content, P.I.I.
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			164
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, Website content, Web history
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			138
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, Website content, P.I.I., Authentication information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			81
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, Website content, Web history, P.I.I., Authentication information, Personal communications, Financial and payment information, Health information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			65
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, Website content
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			56
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, Website content, Web history, P.I.I.
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			52
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, Website content, Web history
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			45
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, Website content, Authentication information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			42
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, Website content, Web history, P.I.I.
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			40
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, Website content, Web history, Authentication information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			34
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, Website content, P.I.I., Authentication information, Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			23
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, Website content, Web history, P.I.I., Authentication information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			23
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, Website content, P.I.I., Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			23
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, Website content, P.I.I.
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			22
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, Website content, P.I.I., Authentication information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			21
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, Website content, P.I.I., Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			20
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, Website content, Web history, P.I.I., Authentication information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			20
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, Website content, Web history, P.I.I., Authentication information, Personal communications, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			19
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, Website content, Web history, P.I.I., Authentication information, Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			16
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, Website content, P.I.I., Authentication information, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			13
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, Website content, Web history, P.I.I., Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			12
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, Website content, Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			12
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, Website content, Web history, Authentication information, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			12
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, Website content, Web history, P.I.I., Authentication information, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			10
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, Website content, P.I.I., Authentication information, Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			10
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, Website content, Web history, Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			9
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, Website content, Web history, Authentication information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			8
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, Website content, P.I.I., Authentication information, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			6
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, Website content, P.I.I., Authentication information, Personal communications, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			5
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, Website content, Web history, Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			5
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, Website content, Web history, P.I.I., Authentication information, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			5
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, Website content, Web history, P.I.I., Authentication information, Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			5
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, Website content, Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			4
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, Website content, Web history, Authentication information, Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			4
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, Website content, Web history, P.I.I., Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			4
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, Website content, Authentication information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			3
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, Website content, Web history, P.I.I., Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			3
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, Website content, Web history, P.I.I., Health information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			3
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, Website content, Web history, P.I.I., Personal communications, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			3
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, Website content, P.I.I., Health information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			3
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, Website content, Web history, P.I.I., Authentication information, Personal communications, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			3
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, Website content, P.I.I., Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, Website content, Web history, P.I.I., Authentication information, Health information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, Website content, Authentication information, Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, Website content, P.I.I., Authentication information, Personal communications, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, Website content, P.I.I., Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, Website content, P.I.I., Personal communications, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, Website content, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, Website content, P.I.I., Health information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, Website content, P.I.I., Personal communications, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, Website content, Web history, Personal communications, Financial and payment information, Health information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, Website content, Web history, P.I.I., Authentication information, Financial and payment information, Health information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, Website content, Web history, P.I.I., Personal communications, Health information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, Website content, Authentication information, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, Website content, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, Website content, Health information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, Website content, Personal communications, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, Website content, P.I.I., Authentication information, Health information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, Website content, Web history, Authentication information, Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, Website content, Web history, P.I.I., Authentication information, Health information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, Website content, Web history, P.I.I., Authentication information, Personal communications, Health information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, Website content, Web history, P.I.I., Personal communications, Health information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
	</tr>
	<tr>
		<td rowspan="18" style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			5
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			824
		</td>
		<td rowspan="18" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1181
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			118
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, Web history
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			82
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, Web history
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			68
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, Authentication information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			35
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			15
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, Authentication information, Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			13
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, Authentication information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			4
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			4
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, Web history, Authentication information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			4
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, Web history, Authentication information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			3
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			3
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, Web history, Personal communications
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, Health information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Location, User activity, Health information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, Authentication information, Financial and payment information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; padding-right: 3pt; padding-left: 3pt;">
			User activity, Personal communications, Health information
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
	</tr>
</table>
P.I.I. refers to Personally Identifiable Information

## Table: Statistical performance changes of the Extensions in different activation modes of extension
<table style="border-collapse: collapse; border: medium; border-spacing: 0px;">
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-top-width: 1px; border-top-style: solid; border-top-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; padding-right: 3pt; padding-left: 3pt;" colspan="2">
			Activation mode
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-top-width: 1px; border-top-style: solid; border-top-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(0, 0, 0); text-align: center; padding-right: 3pt; padding-left: 3pt;" colspan="8">
			No-grant
		</td>
		<td style="border-top-width: 1px; border-top-style: solid; border-top-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;" colspan="8">
			No-login
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; padding-right: 3pt; padding-left: 3pt;" colspan="2">
			Cliff’s $$\delta$$
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(0, 0, 0); text-align: center; padding-right: 3pt; padding-left: 3pt;" colspan="2">
			Signif.
		</td>
		<td style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(0, 0, 0); border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(0, 0, 0); text-align: center; padding-right: 3pt; padding-left: 3pt;" colspan="2">
			Small
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(0, 0, 0); text-align: center; padding-right: 3pt; padding-left: 3pt;" colspan="2">
			Medium
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(0, 0, 0); text-align: center; padding-right: 3pt; padding-left: 3pt;" colspan="2">
			Large
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;" colspan="2">
			Signif.
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;" colspan="2">
			Small
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;" colspan="2">
			Medium
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;" colspan="2">
			Large
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; padding-right: 3pt; padding-left: 3pt;">
			Performance
			<br>
			energy metric
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Tendency
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Count
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Ratio
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(0, 0, 0); text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Count
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(0, 0, 0); text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Ratio
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Count
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Ratio
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Count
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Ratio
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Count
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Ratio
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Count
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Ratio
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Count
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Ratio
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Count
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Ratio
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; padding-right: 3pt; padding-left: 3pt;" rowspan="3">
			Page load
			<br>
			time
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Increase
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
			<br>
			(1)
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			43.16%
			<br>
			(17.31%)
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			43.16%
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			5
			<br>
			(3)
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			46.34%
			<br>
			(17.30%)
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			4
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			47.10%
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			15.96%
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Decrease
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			4
			<br>
			(3)
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			-6.92%
			<br>
			(-3.07%)
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			3
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			-6.51%
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			-8.86%
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
			<br>
			(2)
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			-4.83%
			<br>
			(-7.39%)
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			-4.83%
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Overall
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			6
			<br>
			(4)
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			-6.35%
			<br>
			(-2.06%)
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			5
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			-6.19%
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			-8.86%
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			7
			<br>
			(5)
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			33.16%
			<br>
			(7.02%)
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			6
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			39.75%
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			15.96%
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; padding-right: 3pt; padding-left: 3pt;" rowspan="3">
			Page load
			<br>
			energy
			<br>
			consumption
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Increase
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			5
			<br>
			(1)
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			18.95%
			<br>
			(44.41%)
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			3
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			10.68%
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			18.95%
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			88.17%
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			12
			<br>
			(9)
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			18.45%
			<br>
			(18.51%)
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			7
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			9.52%
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			76.90%
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			4
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			46.06%
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Decrease
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Overall
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			5
			<br>
			(1)
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			18.95%
			<br>
			(44.41%)
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			3
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			10.68%
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			18.95%
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			88.17%
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			12
			<br>
			(9)
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			18.45%
			<br>
			(18.51%)
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			7
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			9.52%
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			76.90%
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			4
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			46.06%
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; padding-right: 3pt; padding-left: 3pt;" rowspan="3">
			Stabilized
			<br>
			 energy
			<br>
			 consumption
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Increase
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			11
			<br>
			(7)
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			2.81%
			<br>
			(3.99%)
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			3.68%
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			4
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			2.57%
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			6
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			4.29%
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			15
			<br>
			(9)
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			2.93%
			<br>
			(1.63%)
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			0.57%
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			2.47%
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			12
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			2.98%
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Decrease
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			<br>
			(1)
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			<br>
			(-0.83%)
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Overall
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			11
			<br>
			(7)
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			2.81%
			<br>
			(3.99%)
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			3.68%
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			4
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			2.57%
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			6
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			4.29%
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			15
			<br>
			(10)
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			2.93%
			<br>
			(1.58%)
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			0.57%
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			2.47%
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			12
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			2.98%
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; padding-right: 3pt; padding-left: 3pt;" colspan="2">
			# of extensions being tested
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;" colspan="8">
			13
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;" colspan="8">
			17
		</td>
	</tr>
</table>

## Table: Statistical performance changes of the Extensions in different activation modes of extension - continue
<table style="border-collapse: collapse; border: medium; border-spacing: 0px;">
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-top-width: 1px; border-top-style: solid; border-top-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; padding-right: 3pt; padding-left: 3pt;" colspan="2">
			Activation mode
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-top-width: 1px; border-top-style: solid; border-top-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;" colspan="8">
			Non-designated
		</td>
		<td style="border-top-width: 1px; border-top-style: solid; border-top-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;" colspan="8">
			Fully-inactive
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; padding-right: 3pt; padding-left: 3pt;" colspan="2">
			Cliff’s $$\delta$$
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;" colspan="2">
			Signif.
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;" colspan="2">
			Small
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;" colspan="2">
			Medium
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;" colspan="2">
			Large
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;" colspan="2">
			Signif.
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;" colspan="2">
			Small
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;" colspan="2">
			Medium
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;" colspan="2">
			Large
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; padding-right: 3pt; padding-left: 3pt;">
			Performance
			<br>
			energy metric
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Tendency
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Count
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Ratio
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Count
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Ratio
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Count
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Ratio
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Count
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Ratio
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Count
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Ratio
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Count
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Ratio
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Count
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Ratio
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Count
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Ratio
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; padding-right: 3pt; padding-left: 3pt;" rowspan="3">
			Page load
			<br>
			time
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Increase
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			335.48%
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			335.48%
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			4
			<br>
			(4)
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			231.28%
			<br>
			(21.25%)
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			109.07%
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			324.68%
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			716.16%
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Decrease
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			3
			<br>
			(2)
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			-36.26%
			<br>
			(-40.87%)
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			-34.07%
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			-60.11%
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Overall
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			335.48%
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			335.48%
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			7
			<br>
			(6)
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			80.27%
			<br>
			(11.06%)
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			109.07%
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			3
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			-31.89%
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			328.02%
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; padding-right: 3pt; padding-left: 3pt;" rowspan="3">
			Page load
			<br>
			energy
			<br>
			consumption
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Increase
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			5
			<br>
			(3)
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			14.46%
			<br>
			(10.68%)
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			3
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			10.19%
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			14.98%
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			728.47%
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			4
			<br>
			(6)
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			577.49%
			<br>
			(13.54%)
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			11.69%
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			283.53%
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			1376.72%
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Decrease
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			<br>
			(1)
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			<br>
			(-60.92%)
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			3
			<br>
			(1)
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			-28.89%
			<br>
			(-5.88%)
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			-4.10%
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			-38.41%
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Overall
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			5
			<br>
			(4)
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			14.46%
			<br>
			(7.95%)
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			3
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			10.19%
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			14.98%
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			728.47%
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			7
			<br>
			(7)
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			11.69%
			<br>
			(10.68%)
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			3.80%
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			3
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			-28.89%
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			1376.72%
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; padding-right: 3pt; padding-left: 3pt;" rowspan="3">
			Stabilized
			<br>
			 energy
			<br>
			 consumption
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Increase
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			3
			<br>
			(7)
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			1.56%
			<br>
			(1.33%)
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			1.06%
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			43.16%
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			8
			<br>
			(9)
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			13.04%
			<br>
			(1.35%)
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			6.66%
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			3
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			14.18%
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			3
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			19.28%
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Decrease
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			5
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			-0.79%
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			5
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			-0.79%
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			3
			<br>
			(1)
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			-27.75%
			<br>
			(-3.84%)
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="text-align: center; padding-right: 3pt; padding-left: 3pt;">
			3
		</td>
		<td style="text-align: right; padding-right: 3pt; padding-left: 3pt;">
			-27.75%
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Overall
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			8
			<br>
			(7)
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			-0.47%
			<br>
			(1.33%)
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			5
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			-0.79%
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			1.06%
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			1
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			43.16%
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			11
			<br>
			(10)
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			8.79%
			<br>
			(1.34%)
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			2
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			6.66%
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			3
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			14.18%
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			6
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: right; padding-right: 3pt; padding-left: 3pt;">
			-7.23%
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; padding-right: 3pt; padding-left: 3pt;" colspan="2">
			# of extensions being tested
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;" colspan="8">
			11
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;" colspan="8">
			11
		</td>
	</tr>
</table>
The bracketed figures indicate the change ratio of corresponding extensions in each activation mode found in the fully loaded mode.

## Table: Studied factors that may influence the performance impact of browser extensions
<table style="border-collapse: collapse; border: medium; border-spacing: 0px;">
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-top-width: 1px; border-top-style: solid; border-top-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; padding-right: 3pt; padding-left: 3pt;">
			Variable Type
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-top-width: 1px; border-top-style: solid; border-top-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; padding-right: 3pt; padding-left: 3pt;">
			Potential Influential Factors
		</td>
		<td style="border-top-width: 1px; border-top-style: solid; border-top-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; text-align: center; padding-right: 3pt; padding-left: 3pt;">
			Description
		</td>
	</tr>
	<tr>
		<td rowspan="30" style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; padding-right: 3pt; padding-left: 3pt;">
			Code Metric
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Ambient Module
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
			Number of ambient modules
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Class
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
			Number of classes&nbsp;
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			ClassFunction
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
			Number of class functions
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Enum
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
			Number of enum classes
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			File
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
			Number of files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Interface
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
			Number of interfaces
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Method
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
			Number of methods
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Namespace
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
			Number of namespaces
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Private Method
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
			Number of private methods
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Public Method
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
			Number of public methods
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Public Static Method
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
			Number of public static methods
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Function
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
			Number of functions
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Unnamed Function
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
			Number of unnamed functions
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			WMC (Weighted Methods per Class)
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
			Number of local (not inherited) methods
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			DIT (Depth of Inheritance Tree)
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
			Maximum depth of class in inheritance tree
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			ev(G) (Essential complexity)
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
			The number of decision points + 1 after control graph reduction
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			CC (Cyclomatic Complexity)
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
			The number of decision points + 1
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			NPATH (Number of Possible Paths)
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
			Number of unique paths trhough a body of code, not countingabnormal exits or gotos
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			CLOC (Comment Lines of Code)
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
			Number of lines containing comment
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			LOC (Lines of Code)
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
			Number of lines containing source code
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			BLOC (Blank Lines of Code)
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
			Number of blank lines
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			NL (Number of Lines)
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
			Number of Lines
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			NPM (Number of Public Methods)
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
			Number of local (not inherited) public methods
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			NPRM (Number Private Methods)
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
			Number of local (not inherited) private methods
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			RFC (Response for a Class)
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
			Number of methods, including inherited ones
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			NIV (Number of Instance Variables)
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
			Number of instance variables
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			NIM (Number of Instance Methods)
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
			Number of instance methods
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			NV (Number of Variables)
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
			Number of class variables
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			NOC (Number of Children)
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
			Number of immediate subclasses
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; padding-right: 3pt; padding-left: 3pt;">
			IFANIN
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; padding-right: 3pt; padding-left: 3pt;">
			Number of immediate base classes
		</td>
	</tr>
	<tr>
		<td rowspan="58" style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; padding-right: 3pt; padding-left: 3pt;">
			File
			<br>
			Characteristic
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .css files
		</td>
		<td rowspan="58" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of various types of files in the extension
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .svg files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .js files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .png files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .html files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .gif files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .eot files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .woff files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .json files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .ttf files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .webm files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .avif files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .ogg files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .map files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .txt files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .dat files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .woff2 files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .jpg files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .psd files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .GIF files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .sendkyes files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .datepick files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .tz files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .blockUI files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .sortable files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .md files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .htm files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .bak files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .otf files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .ico files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .mp3 files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .mem files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .data files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .wasm files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .conf files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .scss files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .less files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .config files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .drconf files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .url files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .xml files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .zip files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .log files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .wav files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .vtt files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .mjs files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .1 files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .6 files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .ts files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .patch files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .targ files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .lock files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .opts files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .cjs files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .in files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .def files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .jst files
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; padding-right: 3pt; padding-left: 3pt;">
			Size of .coffee files
		</td>
	</tr>
	<tr>
		<td rowspan="8" style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; padding-right: 3pt; padding-left: 3pt;">
			Privacy
			<br>
			Practice
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(0, 0, 0); padding-right: 3pt; padding-left: 3pt;">
			Total # of Privacy Practices Used
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(0, 0, 0); padding-right: 3pt; padding-left: 3pt;">
			Number of privacy practice properties
			<br>
			adopted by the extension
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(0, 0, 0); padding-right: 3pt; padding-left: 3pt;">
			Location
		</td>
		<td rowspan="7" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(0, 0, 0); padding-right: 3pt; padding-left: 3pt;">
			Seven privacy practice items
			<br>
			adopted by the extension
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User Activity
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Website Content
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Web History
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			P.I.I.
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Authentication Information
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; padding-right: 3pt; padding-left: 3pt;">
			Personal Communications
		</td>
	</tr>
	<tr>
		<td rowspan="3" style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			User
			<br>
			Perspective
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Number of Users
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
			Number of users installing the extension
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Number of Raters
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
			Number of users rating the extension
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Extension Size
		</td>
		<td style="padding-right: 3pt; padding-left: 3pt;">
			The extension package size
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; padding-right: 3pt; padding-left: 3pt;">
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; padding-right: 3pt; padding-left: 3pt;">
			Rating Score
		</td>
		<td style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; padding-right: 3pt; padding-left: 3pt;">
			The rating score of the extensionin Chrome Web Store
		</td>
	</tr>
	<tr>
		<td rowspan="4" style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; padding-right: 3pt; padding-left: 3pt;">
			Activation
			<br>
			Mode
		</td>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Logged in
		</td>
		<td rowspan="4" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; padding-right: 3pt; padding-left: 3pt;">
			Four activation modes of extensions
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Access to webpage granted
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; padding-right: 3pt; padding-left: 3pt;">
			Non-designated mode
		</td>
	</tr>
	<tr>
		<td style="border-right-width: 1px; border-right-style: solid; border-right-color: black; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: black; padding-right: 3pt; padding-left: 3pt;">
			Fully-inactive mode
		</td>
	</tr>
</table>