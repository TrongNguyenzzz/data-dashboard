package Data.API.model;

import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "chartDescribe")
@Data
public class ChartDescription  {
    @Id
    private ObjectId id;

    private String category;

    private String description;

    private List<String> topList;

    private Float[] numbers;

    public ChartDescription(String category, String description, List<String> topList, Float[] numbers) {
        this.category = category;
        this.description = description;
        this.topList = topList;
        this.numbers = numbers;
    }
}
