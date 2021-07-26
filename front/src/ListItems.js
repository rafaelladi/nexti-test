import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

const ListItems = ({items, changePage}) => {
    return (
        <div>
            {items.map((item, i) => (
                <ListItem button key={item.title} onClick={() => changePage(i)}>
                    <ListItemIcon>
                        {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.title} />
                </ListItem>
            ))}
        </div>
    )
}

export default ListItems;