# Aletheia
To run the application, run following commands in order : 

```
yarn install
yarn prisma generate
yarn dev
```

To get a lightweight GUI for viewing and editing database tables, run:
```
yarn prisma studio
```

### This week's goals:

- [ ] a) Complete API integration for data entry in the Database, accessible via Postman.
- [ ] b) Implement UI for the Integration Page, specifically for Slack and JIRA.
- [ ] c) Display all attributes in Columns on the Events and Devices Tabs.
- [ ] d) Optimize the Overview page by fetching pre-calculated metrics data from another API. Additionally, present the data using a Bar Chart.
- [ ] e) Implement background loading of Devices and Events data upon user login to ensure a smoother transition.
- [ ] f) Create a detailed profile view for either User or Device. Show User device attributes and if the User is logged on to multiple devices.
- [ ] g) Remove Tabs (Events and Devices) that don't have any data.
- [ ] h) Remove the Users Tab.
- [ ] i) Ensure the User ID in Events is a number and not randomly generated.
- [ ] j) A pie chart that shows ratio by country.


