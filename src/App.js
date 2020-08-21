import React, { useEffect } from 'react';
import './App.css';
import CKEditor from 'ckeditor4-react';


var CONTACTS = [{
  name: 'Huckleberry Finn',
  tel: '+48 1345 234 235',
  email: 'h.finn@example.com',
  avatar: 'hfin'
},
{
  name: 'D\'Artagnan',
  tel: '+45 2345 234 235',
  email: 'dartagnan@example.com',
  avatar: 'dartagnan'
},
{
  name: 'Phileas Fogg',
  tel: '+44 3345 234 235',
  email: 'p.fogg@example.com',
  avatar: 'pfog'
},
{
  name: 'Alice',
  tel: '+20 4345 234 235',
  email: 'alice@example.com',
  avatar: 'alice'
},
{
  name: 'Little Red Riding Hood',
  tel: '+45 2345 234 235',
  email: 'lrrh@example.com',
  avatar: 'lrrh'
},
{
  name: 'Winnetou',
  tel: '+44 3345 234 235',
  email: 'winnetou@example.com',
  avatar: 'winetou'
},
{
  name: 'Edmond Dantès',
  tel: '+20 4345 234 235',
  email: 'count@example.com',
  avatar: 'edantes'
},
{
  name: 'Robinson Crusoe',
  tel: '+45 2345 234 235',
  email: 'r.crusoe@example.com',
  avatar: 'rcrusoe'
}
];

function App() {

  useEffect(() => {
    
  }, [])
  return (
    <div className="App">
      <CKEditor
        config={{
          extraAllowedContent: 'span(*)',
          fullPage: true,
          allowedContent: true
        }}
        onBeforeLoad={(CKEDITOR) => {
          CKEDITOR.editorUrl = 'https://cdn.ckeditor.com/4.14.1/full-all/ckeditor.js';
          console.log("editor ->",CKEDITOR);
          CKEDITOR.on('instanceReady', function() {
            let editor1 = CKEDITOR.instances.editor1;
            editor1.widgets.add('hcard', {
              allowedContent: 'span(!h-card); a[href](!u-email,!p-name); span(!p-tel)',
              requiredContent: 'span(h-card)',
              pathName: 'hcard',
    
              upcast: function(el) {
                return el.name == 'span' && el.hasClass('h-card');
              }
            });
            editor1.on('paste', function(evt) {
              
              var contact = evt.data.dataTransfer.getData('contact');
              if (!contact) {
                return;
              }
    
              evt.data.dataValue =
                '<span style="background: #FFFDE3; padding: 3px 6px; border-bottom: 1px dashed #ccc"  class="h-card">' +
                '<a href="mailto:' + contact.email + '" class="p-name u-email">' + contact.name + '</a>' +
                ' ' +
                '<span class="p-tel">' + contact.tel + '</span>' +
                '</span>';
                console.log("paste ->",evt.data.dataValue);

            });
            console.log("editor1",CKEDITOR.instances.editor1)
            
            // When an item in the contact list is dragged, copy its data into the drag and drop data transfer.
            // This data is later read by the editor#paste listener in the hcard plugin defined above.
            CKEDITOR.document.getById('contactList').on('dragstart', function(evt) {

              console.log("drag start");
              // The target may be some element inside the draggable div (e.g. the image), so get the div.h-card.
              var target = evt.data.getTarget().getAscendant('div', true);
      
              // Initialization of the CKEditor 4 data transfer facade is a necessary step to extend and unify native
              // browser capabilities. For instance, Internet Explorer does not support any other data type than 'text' and 'URL'.
              // Note: evt is an instance of CKEDITOR.dom.event, not a native event.
              CKEDITOR.plugins.clipboard.initDragDataTransfer(evt);
              console.log("drag event ->", evt);
              var dataTransfer = evt.data.dataTransfer;
      
              // Pass an object with contact details. Based on it, the editor#paste listener in the hcard plugin
              // will create the HTML code to be inserted into the editor. You could set 'text/html' here as well, but:
              // * It is a more elegant and logical solution that this logic is kept in the hcard plugin.
              // * You do not know now where the content will be dropped and the HTML to be inserted
              // might vary depending on the drop target.
              console.log("target ->",dataTransfer, target);
              dataTransfer.setData('contact', CONTACTS[target.data('contact')]);
      
              // You need to set some normal data types to backup values for two reasons:
              // * In some browsers this is necessary to enable drag and drop into text in the editor.
              // * The content may be dropped in another place than the editor.
              dataTransfer.setData('text/html', target.getText());
            });
          });
        }} 
        data={""} 
        onChange={(event) => console.log("in editor ->", event.editor.getData())}
      />
      <div className="contacts">
      <h3>List of Droppable Contacts</h3>
      <ul id="contactList">
      <div className="contact h-card" data-contact="0" draggable="true" tabIndex="0">
        Huckleberry Finn
      </div>
      <div className="contact h-card" data-contact="1" draggable="true" tabIndex="1">
        Alice
      </div>
      </ul>
    </div>
    </div>
  );
}

export default App;
