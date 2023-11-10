package Data.API.controller;

import Data.API.model.FirstChart;
import Data.API.repository.ChartDescriptionRepository;
import Data.API.repository.FirstChartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.lang.reflect.Array;
import java.util.*;

@RestController
@RequestMapping("/info")
public class InfoController {

    @Autowired
    private FirstChartRepository firstChartRepository;

    @Autowired
    private FirstChartController firstChartController;

    @Autowired
    private ChartDescriptionRepository chartDescriptionRepository;

    public class MultiThread extends Thread{
        private MultipartFile file;

        private String commandFile;

        private String plot;

        public MultiThread(MultipartFile file, String commandFile, String plot) {
            this.file = file;
            this.commandFile = commandFile;
            this.plot = plot;
        }

        public void run() {
            try {
                // Running the code
                receivedAndProcess(file, commandFile, plot);
            } catch (Exception e) {
                // Throwing an exception
                System.out.println("Exception is caught");
            }
        }

        private ResponseEntity<String> receivedAndProcess(MultipartFile currFile, String commandFile, String plot) throws IOException {
//        String fileName = currFile.getOriginalFilename();

            // Create a temporary file
            File file = File.createTempFile(currFile.getOriginalFilename(), ".tmp");

            // Transfer the content from the MultipartFile to the File
            currFile.transferTo(file);

            HashMap<String, ArrayList<String>> result = processData(file);

            return firstChartController.analyzeChart(result, commandFile, plot);
        }

        private HashMap<String, ArrayList<String>> processData(File fileContent) throws FileNotFoundException {
            HashMap<String, ArrayList<String>> contentMap = new HashMap<String, ArrayList<String>>();

            // Get the length

            Scanner sc = new Scanner(fileContent);

            String[] title = sc.nextLine().split(",");

            // Add column with array to hashmap

            for(String col: title) {
                contentMap.put(col, new ArrayList<String>());
            }

            Integer column = title.length;

            while (sc.hasNextLine())  //returns a boolean value
            {
                String temp = sc.nextLine();
                String[] line = temp.split(",");
                if(line.length == column) {
                    for(int i = 0; i < column; i++) {
                        contentMap.get(title[i]).add(line[i]);
                    }
                }
            }

            sc.close();  //closes the scanner

            return contentMap;
        }
    }

    @GetMapping("/firstChart")
    public List<FirstChart> getFirstChart() {
        return firstChartRepository.findAll();
    }

    @DeleteMapping("/firstChart")
    public void deleteFirstChart() {
        firstChartRepository.deleteAll();
        chartDescriptionRepository.deleteAll();
    }

    @PostMapping("/{command}/{plot}")
    public String testing(@RequestBody MultipartFile file1, @RequestBody MultipartFile file2,  @RequestBody MultipartFile file3 , @PathVariable String command, @PathVariable String plot) {
        String[] commandList = command.split(",");
        Arrays.sort(commandList);

        for(int i = 0; i < commandList.length; i++) {
            MultipartFile current = file1;
            if (i == 1) {
                current = file2;
            } else if (i == 2) {
                current = file3;
            }
            MultiThread newThread = new MultiThread(current, commandList[i], plot);
            newThread.run();
        }

        return "ok";
    }

//    @PostMapping("/{commandFile}")
//    public ResponseEntity<String> receivedAndProcess(@RequestBody MultipartFile currFile, @PathVariable String commandFile) throws IOException {
//        String fileName = currFile.getOriginalFilename();
//
//        // Create a temporary file
//        File file = File.createTempFile(currFile.getOriginalFilename(), ".tmp");
//
//        // Transfer the content from the MultipartFile to the File
//        currFile.transferTo(file);
//
//        HashMap<String, ArrayList<String>> result = processData(file);
//
//        return firstChartController.analyzeChart(result, commandFile);
//    }
//
//    private HashMap<String, ArrayList<String>> processData(File fileContent) throws FileNotFoundException {
//        HashMap<String, ArrayList<String>> contentMap = new HashMap<String, ArrayList<String>>();
//
//        // Get the length
//
//        Scanner sc = new Scanner(fileContent);
//
//        String[] title = sc.nextLine().split(",");
//
//
//        // Add column with array to hashmap
//
//        for(String col: title) {
//            contentMap.put(col, new ArrayList<String>());
//        }
//
//        Integer column = title.length;
//
//        while (sc.hasNextLine())  //returns a boolean value
//        {
//            String temp = sc.nextLine();
//            String[] line = temp.split(",");
//            if(line.length == column) {
//                for(int i = 0; i < column; i++) {
//                    contentMap.get(title[i]).add(line[i]);
//                }
//            }
//        }
//
//        sc.close();  //closes the scanner
//
//        return contentMap;
//    }
}
