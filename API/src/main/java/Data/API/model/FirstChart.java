package Data.API.model;

import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "firstChart")
@Data
public class FirstChart {
    @Id
    private ObjectId id;

    private List<String> colName;

    private Integer[] data;

    private String category;

    private String plot;

    private String plotType;

    public FirstChart(List<String> colName, Integer[] data, String category, String plot, String plotType) {
        this.colName = colName;
        this.data = data;
        this.category = category;
        this.plot = plot;
        this.plotType = plotType;
    }

}
